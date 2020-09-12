/*
    Общие функции
*/
const yandexMaps = () => {

    const init = () => {
        var smallMap = new ymaps.Map('ya-map-contacts', {
            center: [53.842377, 27.559467],
            zoom: 16,
        });
        var bigMap = new ymaps.Map('ya-map-contacts-full', {
            center: [53.842377, 27.559467],
            zoom: 16,
        });
    };

    ymaps.ready(init);
};

const imgToBackground = () => {
    document.querySelectorAll(".ibg").forEach(el => {
        if (el.querySelector('img')) {
            el.style.backgroundImage = 'url(' + el.querySelector('img').getAttribute('src') + ')';
            el.querySelector('img').style.display = 'none';
        }
    });
};

const burgerMenu = (className) => {
    const burger = document.querySelector('.burger');
    const burgerMenu = document.querySelector(`.${className}`);
    if (burgerMenu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('is-active');
            burgerMenu.classList.toggle('is-shown');
            document.querySelector('body').classList.toggle('lock');
        });
    }
};

const popups = () => {

    const popups = document.querySelectorAll('.popup');
    const popupOpenLinks = document.querySelectorAll('.js-popup-open');
    const popupCloseLinks = document.querySelectorAll('.js-popup-close');
    const lockPadding = document.querySelectorAll('.lock-padding');
    const body = document.querySelector('body');

    let lockPaddingOffset = null;
    let burger = null;
    let isTransitioning = false;
    let shouldUnlock = false;

    function _bodyLock() {
        lockPaddingOffset = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
        if (lockPadding.length > 0) {
            lockPadding.forEach(element => {
                element.style.paddingRight = lockPaddingOffset;
            });
        }
        body.style.paddingRight = lockPaddingOffset;
        body.classList.add('lock');
    }

    function _bodyUnlock() {
        isTransitioning = false;
        if (shouldUnlock) {
            body.style.paddingRight = '0px';
            body.classList.remove('lock');
            if (lockPadding.length > 0) {
                lockPadding.forEach(element => {
                    element.style.paddingRight = '0px';
                });
            }
            shouldUnlock = false;
        }
    }

    function _popupOpen(openingPopup) {
        if (!isTransitioning) {
            isTransitioning = true;
            const popupActive = document.querySelector('.popup.is-opened');
            if (popupActive) {
                _popupClose(popupActive, false);
            }
            openingPopup.scrollTo(0, 0);
            openingPopup.classList.add('is-opened');
            _bodyLock();
        }
    }

    function _popupClose(closingPopup, unlock = true) {
        if (!isTransitioning) {
            isTransitioning = true;
            burger = document.querySelector('.burger.is-active');
            closingPopup.classList.remove('is-opened');
            if (unlock && !burger) {
                shouldUnlock = true;
            }
        }
    }

    function init() {

        if (popupOpenLinks.length > 0) {
            popupOpenLinks.forEach(popupLink => {
                popupLink.addEventListener('click', e => {
                    e.preventDefault();
                    const openingPopup = document.querySelector(popupLink.getAttribute('href'));
                    if (openingPopup) {
                        _popupOpen(openingPopup);
                    }
                });
            });
        }

        if (popupCloseLinks.length > 0) {
            popupCloseLinks.forEach(popupLink => {
                popupLink.addEventListener('click', e => {
                    e.preventDefault();
                    _popupClose(popupLink.closest('.popup'));
                });
            });
        }

        if (popups.length > 0) {

            popups.forEach(element => {
                element.addEventListener('transitionend', e => {
                    if (e.propertyName === 'transform') {
                        _bodyUnlock();
                    }
                });

                element.addEventListener('click', e => {
                    if (!e.target.closest('.popup__body')) {
                        _popupClose(e.target.closest('.popup.is-opened'));
                    }
                });
            });

            document.addEventListener('keydown', e => {
                if (e.which === 27) {
                    const openedPopup = document.querySelector('.popup.is-opened');
                    if (openedPopup) {
                        _popupClose(openedPopup);
                    }
                }
            });
        }
    }

    init();

};

const formValidation = () => {
    const forms = document.querySelectorAll('.form')
    forms.forEach((formItem) => {
        const pristine = new Pristine(formItem);
        formItem.addEventListener('submit', function (e) {
            e.preventDefault();
            const valid = pristine.validate();
            if (valid) {
                formItem.submit();
            } else {
                setTimeout(() => {
                    pristine.reset();
                }, 5000)
            }
        });
    })
};

const inputMasking = () => {
    document.querySelectorAll('.js-mask-phone').forEach(item => {
        item.addEventListener('input', e => {
            VMasker(e.target).maskPattern("(999) 999-99-99");
        });
    });
};

const inputsFilter = () => {
    document.querySelectorAll('.js-only-digits').forEach(item => {
        item.addEventListener('input', e => {
            e.target.value = e.target.value.replace(/\D/g, '');
        })
    })
};

const preloader = () => {
    const preloaderBody = document.querySelector('.preloader__body');
    const preloader = document.querySelector('.preloader');
    const body = document.querySelector('body');
    if (preloader) {
        body.classList.add('lock');
        new Promise((resolve) => {
            setTimeout(resolve, 800)
        })
            .then(() => {
                preloaderBody.style.display = 'none';
                preloader.classList.add('is-loaded');
                body.classList.remove('lock');
            });
    }
};

const htmlMover = () => {
    
    const movingElements = document.querySelectorAll('[data-html-mover]');
    const movingElementsPositions = [];
    const mediaQueries = [];

    function _debounce(func, delay) {
        let inDebounce;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(inDebounce);
            inDebounce = setTimeout(() => func.apply(context, args), delay);
        }
    };

    function _getElementByIndex(parent, index) {
        const children = parent.children;
        if (children.length > 0) {
            return children[index];
        } else {
            return null;
        }
    };

    function _getElementByClass(parent, className) {
        return parent.querySelector(`.${className}`);
    };

    function _getIndexInParent(element) {
        const children = Array.prototype.slice.call(element.parentNode.children);
        return children.indexOf(element);
    };

    function _insertBefore(element, sibling) {
        sibling.before(element);
    };

    function _insertToEnd(element, parent) {
        parent.append(element);
    };

    function _smartInsert(element, parent, index) {
        const insertingBefore = _getElementByIndex(parent, index);
        if (insertingBefore) {
            _insertBefore(element, insertingBefore);
        } else {
            _insertToEnd(element, parent);
        }
    };

    function _sort(array) {
        array.sort((a, b) => {
            if (a.breakpoint > b.breakpoint) {
                return -1
            } else {
                return 1
            }
        });
    };

    function createMediaquery() {
        if (movingElementsPositions.length > 0) {
            movingElementsPositions.forEach((element) => {
                mediaQueries.push(window.matchMedia(`(max-width: ${element.breakpoint}px`));
            });
        }
    };

    function move() {
        movingElementsPositions.forEach((element, index) => {
            const htmlClass = `html-mover-${element.breakpoint}`;
            if (mediaQueries[index].matches) {
                if (element.originalParent !== element.newParent) {
                    if (!element.movingElement.classList.contains(htmlClass) && element.originalParent !== element.newParent) {
                        switch (element.newPlace) {
                            case 'first':
                                _smartInsert(element.movingElement, element.newParent, 0);
                                break;

                            case 'last':
                                _smartInsert(element.movingElement, element.newParent);
                                break;

                            default: {
                                if (parseInt(element.newPlace) >= 0) {
                                    _smartInsert(element.movingElement, element.newParent, parseInt(element.newPlace));
                                } else {
                                    const insertingBefore = _getElementByClass(element.newParent, element.newPlace);
                                    if (insertingBefore) {
                                        _insertBefore(element.movingElement, insertingBefore)
                                    }
                                }
                                break;
                            }
                        }
                        element.movingElement.classList.add(htmlClass);
                    }
                } else {
                    console.warn('HTML-mover: элемент', element.movingElement, 'имеет неверный селектор!');
                }
            } else {
                if (element.movingElement.classList.contains(htmlClass)) {
                    _smartInsert(element.movingElement, element.originalParent, element.originalPlace);
                    element.movingElement.classList.remove(htmlClass);
                }
            }
        });
    };

    function init() {
        if (movingElements.length > 0) {
            movingElements.forEach((element, index) => {
                const attributeArray = element.getAttribute('data-html-mover').split(',');
                movingElementsPositions[index] = {
                    movingElement: element,
                    originalParent: element.parentNode,
                    originalPlace: _getIndexInParent(element),
                    newParent: document.querySelector(`.${attributeArray[0]}`) || element.parentNode,
                    newPlace: attributeArray[1].trim() || 'last',
                    breakpoint: parseInt(attributeArray[2].trim()) || 767
                };
            });
            _sort(movingElementsPositions);
            createMediaquery();
            move();
            window.addEventListener('resize', _debounce(move, 50));
        }
    };

    init();
}