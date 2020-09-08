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
};

const rating = () => {
	const container = document.querySelector('.rating');
	if (container) {
		const items = container.querySelectorAll('.rating__item');
		container.onclick = function (e) {
			if (!e.target.classList.contains('is-active')) {
				items.forEach(function (item) {
					item.classList.remove('is-active');
				});
				e.target.classList.add('is-active');
			}
		}
	}
};

const quantitySelector = () => {
	const quantitySelectors = document.querySelectorAll('.js-quantity-selector');
	if (quantitySelectors.length > 0) {
		quantitySelectors.forEach(quantitySelector => {
			quantitySelector.addEventListener('click', e => {
				if (e.target.classList.contains('quantity-selector__minus')) {
					var number = +quantitySelector.querySelector('.quantity-selector__value').textContent.replace('шт', '');
					var newNumber;
					if (number !== 1) {
						newNumber = number - 1;
					} else {
						return;
					}
					quantitySelector.querySelector('.quantity-selector__value').textContent = `${newNumber} шт`;
				}

				if (e.target.classList.contains('quantity-selector__plus')) {
					var number = +quantitySelector.querySelector('.quantity-selector__value').textContent.replace('шт', '');
					var newNumber;
					newNumber = number + 1;
					quantitySelector.querySelector('.quantity-selector__value').textContent = `${newNumber} шт`;
				}
			});
		});
	}
};

const burgerCategories = () => {
	document.querySelector('.js-burger-menu').addEventListener('click', e => {
		if (e.target.closest('.categories-burger-menu__header')) {
			e.target.closest('.categories-burger-menu').classList.toggle('is-opened');
		}
	});
};

const sortingSelect = () => {
	const selectors = document.querySelectorAll('.js-sorting-select');
	if (selectors.length > 0) {
		selectors.forEach(selector => {
			selector.addEventListener('click', e => {
				if (e.target.classList.contains('sorting__item')) {
					e.target.closest('.sorting__list').querySelector('.is-active').classList.remove('is-active');
					e.target.classList.add('is-active');
				}
			});
		});
	}
};

const categories = () => {
	
	const botHeaderList = document.querySelector('.menu-bot-header__list');
	const submenuParent = document.querySelector('.menu-bot-header__content');
	const allSubmenus = submenuParent.querySelectorAll('.catalog-nav');
	const allSubmenuLinks = botHeaderList.querySelectorAll('.menu-bot-header__link');

	botHeaderList.addEventListener('click', (e) => {
		if (e.target.classList.contains('menu-bot-header__link')) {
			e.preventDefault();
			const targetSubmenuId = e.target.getAttribute('href');
			const targetSubmenuObject = submenuParent.querySelector(`${targetSubmenuId}`);
			
			if (targetSubmenuObject.classList.contains('is-shown')) {
				e.target.classList.remove('is-active');
				targetSubmenuObject.classList.remove('is-shown');
			} else {
				allSubmenuLinks.forEach((el) => {
					el.classList.remove('is-active');
				});
				allSubmenus.forEach((el) => {
					el.classList.remove('is-shown');
				});
				setTimeout(() => {
					e.target.classList.add('is-active');
					targetSubmenuObject.classList.add('is-shown');
				}, 100);
			}
		}
	});

	document.querySelector('body').addEventListener('click', e => {
		const openedCategory = document.querySelector('.catalog-nav.is-shown');
		const activeLink = document.querySelector('.menu-bot-header__link.is-active');
		if (openedCategory) {
			if (!e.target.closest('.catalog-nav') && !e.target.classList.contains('menu-bot-header__link')) {
				openedCategory.classList.remove('is-shown');
				activeLink.classList.remove('is-active');
			}
		}
	});
};

const selectors = () => {
	
	document.querySelectorAll('.selector').forEach(select => {
		const selectCurrent = select.querySelector('.selector__current'),
			selectList = select.querySelector('.selector__options'),
			selectInput = select.querySelector('.selector__input'),
			selectItem = select.querySelectorAll('.selector__option');

		selectCurrent.addEventListener('click', () => {
			selectList.closest('.selector').classList.toggle('is-shown');
		})

		selectItem.forEach(item => {
			item.addEventListener('click', () => {
				const itemValue = item.getAttribute('data-value')
				const itemText = item.textContent
				selectInput.value = itemValue
				selectCurrent.textContent = itemText
				selectListHide();
				if (select.nextElementSibling.querySelector('button')) {
					if (select.nextElementSibling.querySelector('button').disabled) {
						select.nextElementSibling.querySelector('button').disabled = false;
						return;
					}
				}
			});
		});

		const selectListHide = () => {
			selectList.closest('.selector').classList.remove('is-shown');
		};

		document.addEventListener('mouseup', (e) => {
			if (!select.contains(e.target)) selectListHide();
		});

	});
};

const threeDotsMenu = () => {
	const threeDotsBtn = document.querySelector('.three-dots__btn');
	const threeDotsBody = document.querySelector('.js-three-dots-body');
	if (threeDotsBody) {
		threeDotsBtn.addEventListener('click', () => {
			threeDotsBody.classList.toggle('is-shown');
		});
	}

	document.querySelector('body').addEventListener('click', e => {
		if (!e.target.closest('.three-dots__body') && !e.target.closest('.three-dots__btn')) {
			threeDotsBody.classList.remove('is-shown');
		}
	});
};

const catalogueMenu = () => {
	document.querySelector('.js-catalogue-btn').addEventListener('click', (e) => {
		e.preventDefault();
		document.querySelector('.catalogue__body').classList.toggle('is-opened');
	});
};

const cartToggle = () => {
	document.querySelector('.js-cart-btn').addEventListener('click', () => {
		document.querySelector('.cart').classList.toggle('is-opened');
	});

	document.querySelector('body').addEventListener('click', e => {
		if (e.target.closest('.js-cart-btn')) return;
		if (!e.target.closest('.cart')) {
			document.querySelector('.cart').classList.remove('is-opened');
		}
	});
};

const searchInput = () => {

	const searchbar = document.querySelector('.searchbar__input');

	if (searchbar) {
		searchbar.addEventListener('keyup', (e) => {
			if (e.target.value.length > 2) {
				document.querySelector('.search-tip').classList.add('is-shown');
			} else {
				document.querySelector('.search-tip').classList.remove('is-shown');
			}
		});
	
		searchbar.addEventListener('blur', (e) => {
			if (e.target.value.length > 2) {
				document.querySelector('.search-tip').classList.remove('is-shown');
			}
		});
	
		searchbar.addEventListener('focus', (e) => {
			if (e.target.value.length > 2) {
				document.querySelector('.search-tip').classList.add('is-shown');
			}
		});
	}
};

const sliders = () => {

	const sliderBanner = new Swiper('.banner-slider__container', {
		pagination: {
			el: '.banner-slider__pagination'
		},
		spaceBetween: 100,
		slidesPerView: 1
	});

	const sliderPartners = new Swiper('.footer-slider__container', {
		spaceBetween: 5,
		slidesPerView: 1,
		loop: true,
		navigation: {
			nextEl: '.footer-slider__button--next',
			prevEl: '.footer-slider__button--prev'
		},
		breakpoints: {
			850: {
				slidesPerView: 4,
			},
			900: {
				slidesPerView: 7,
			}
		}

	});
	
};

document.addEventListener("DOMContentLoaded", () => {

	imgToBackground();
	burgerMenu('burger-menu');
	popups();
	formValidation();
	inputMasking();
	inputsFilter();
	preloader();

	selectors();
	threeDotsMenu();
	catalogueMenu();
	sliders();
	cartToggle();
	searchInput();
	categories();
	sortingSelect();
	burgerCategories();
	quantitySelector();
	rating();
	htmlMover();
	// yandexMaps();
});
