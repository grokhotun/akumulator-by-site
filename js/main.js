"use strict";

/*
    Полифилы
*/
// Полифил на forEach
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;

    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

;
/*
    Общие функции
*/

var yandexMaps = function yandexMaps() {
  var init = function init() {
    var smallMap = new ymaps.Map('ya-map-contacts', {
      center: [53.842377, 27.559467],
      zoom: 16
    });
    var bigMap = new ymaps.Map('ya-map-contacts-full', {
      center: [53.842377, 27.559467],
      zoom: 16
    });
  };

  ymaps.ready(init);
};

var imgToBackground = function imgToBackground() {
  document.querySelectorAll(".ibg").forEach(function (el) {
    if (el.querySelector('img')) {
      el.style.backgroundImage = 'url(' + el.querySelector('img').getAttribute('src') + ')';
      el.querySelector('img').style.display = 'none';
    }
  });
};

var burgerMenu = function burgerMenu(className) {
  var burger = document.querySelector('.burger');
  var burgerMenu = document.querySelector(".".concat(className));

  if (burgerMenu) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('is-active');
      burgerMenu.classList.toggle('is-shown');
      document.querySelector('body').classList.toggle('lock');
    });
  }
};

var popups = function popups() {
  var popups = document.querySelectorAll('.popup');
  var popupOpenLinks = document.querySelectorAll('.js-popup-open');
  var popupCloseLinks = document.querySelectorAll('.js-popup-close');
  var lockPadding = document.querySelectorAll('.lock-padding');
  var body = document.querySelector('body');
  var lockPaddingOffset = null;
  var burger = null;
  var isTransitioning = false;
  var shouldUnlock = false;

  function _bodyLock() {
    lockPaddingOffset = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

    if (lockPadding.length > 0) {
      lockPadding.forEach(function (element) {
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
        lockPadding.forEach(function (element) {
          element.style.paddingRight = '0px';
        });
      }

      shouldUnlock = false;
    }
  }

  function _popupOpen(openingPopup) {
    if (!isTransitioning) {
      isTransitioning = true;
      var popupActive = document.querySelector('.popup.is-opened');

      if (popupActive) {
        _popupClose(popupActive, false);
      }

      openingPopup.scrollTo(0, 0);
      openingPopup.classList.add('is-opened');

      _bodyLock();
    }
  }

  function _popupClose(closingPopup) {
    var unlock = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

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
      popupOpenLinks.forEach(function (popupLink) {
        popupLink.addEventListener('click', function (e) {
          e.preventDefault();
          var openingPopup = document.querySelector(popupLink.getAttribute('href'));

          if (openingPopup) {
            _popupOpen(openingPopup);
          }
        });
      });
    }

    if (popupCloseLinks.length > 0) {
      popupCloseLinks.forEach(function (popupLink) {
        popupLink.addEventListener('click', function (e) {
          e.preventDefault();

          _popupClose(popupLink.closest('.popup'));
        });
      });
    }

    if (popups.length > 0) {
      popups.forEach(function (element) {
        element.addEventListener('transitionend', function (e) {
          if (e.propertyName === 'transform') {
            _bodyUnlock();
          }
        });
        element.addEventListener('click', function (e) {
          if (!e.target.closest('.popup__body')) {
            _popupClose(e.target.closest('.popup.is-opened'));
          }
        });
      });
      document.addEventListener('keydown', function (e) {
        if (e.which === 27) {
          var openedPopup = document.querySelector('.popup.is-opened');

          if (openedPopup) {
            _popupClose(openedPopup);
          }
        }
      });
    }
  }

  init();
};

var formValidation = function formValidation() {
  var forms = document.querySelectorAll('.form');
  forms.forEach(function (formItem) {
    var pristine = new Pristine(formItem);
    formItem.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = pristine.validate();

      if (valid) {
        formItem.submit();
      } else {
        setTimeout(function () {
          pristine.reset();
        }, 5000);
      }
    });
  });
};

var inputMasking = function inputMasking() {
  document.querySelectorAll('.js-mask-phone').forEach(function (item) {
    item.addEventListener('input', function (e) {
      VMasker(e.target).maskPattern("(999) 999-99-99");
    });
  });
};

var inputsFilter = function inputsFilter() {
  document.querySelectorAll('.js-only-digits').forEach(function (item) {
    item.addEventListener('input', function (e) {
      e.target.value = e.target.value.replace(/\D/g, '');
    });
  });
};

var preloader = function preloader() {
  var preloaderBody = document.querySelector('.preloader__body');
  var preloader = document.querySelector('.preloader');
  var body = document.querySelector('body');

  if (preloader) {
    body.classList.add('lock');
    new Promise(function (resolve) {
      setTimeout(resolve, 800);
    }).then(function () {
      preloaderBody.style.display = 'none';
      preloader.classList.add('is-loaded');
      body.classList.remove('lock');
    });
  }
};

var htmlMover = function htmlMover() {
  var movingElements = document.querySelectorAll('[data-html-mover]');
  var movingElementsPositions = [];
  var mediaQueries = [];

  function _debounce(func, delay) {
    var inDebounce;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(inDebounce);
      inDebounce = setTimeout(function () {
        return func.apply(context, args);
      }, delay);
    };
  }

  ;

  function _getElementByIndex(parent, index) {
    var children = parent.children;

    if (children.length > 0) {
      return children[index];
    } else {
      return null;
    }
  }

  ;

  function _getElementByClass(parent, className) {
    return parent.querySelector(".".concat(className));
  }

  ;

  function _getIndexInParent(element) {
    var children = Array.prototype.slice.call(element.parentNode.children);
    return children.indexOf(element);
  }

  ;

  function _insertBefore(element, sibling) {
    sibling.before(element);
  }

  ;

  function _insertToEnd(element, parent) {
    parent.append(element);
  }

  ;

  function _smartInsert(element, parent, index) {
    var insertingBefore = _getElementByIndex(parent, index);

    if (insertingBefore) {
      _insertBefore(element, insertingBefore);
    } else {
      _insertToEnd(element, parent);
    }
  }

  ;

  function _sort(array) {
    array.sort(function (a, b) {
      if (a.breakpoint > b.breakpoint) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  ;

  function createMediaquery() {
    if (movingElementsPositions.length > 0) {
      movingElementsPositions.forEach(function (element) {
        mediaQueries.push(window.matchMedia("(max-width: ".concat(element.breakpoint, "px")));
      });
    }
  }

  ;

  function move() {
    movingElementsPositions.forEach(function (element, index) {
      var htmlClass = "html-mover-".concat(element.breakpoint);

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

              default:
                {
                  if (parseInt(element.newPlace) >= 0) {
                    _smartInsert(element.movingElement, element.newParent, parseInt(element.newPlace));
                  } else {
                    var insertingBefore = _getElementByClass(element.newParent, element.newPlace);

                    if (insertingBefore) {
                      _insertBefore(element.movingElement, insertingBefore);
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
  }

  ;

  function init() {
    if (movingElements.length > 0) {
      movingElements.forEach(function (element, index) {
        var attributeArray = element.getAttribute('data-html-mover').split(',');
        movingElementsPositions[index] = {
          movingElement: element,
          originalParent: element.parentNode,
          originalPlace: _getIndexInParent(element),
          newParent: document.querySelector(".".concat(attributeArray[0])) || element.parentNode,
          newPlace: attributeArray[1].trim() || 'last',
          breakpoint: parseInt(attributeArray[2].trim()) || 767
        };
      });

      _sort(movingElementsPositions);

      createMediaquery();
      move();
      window.addEventListener('resize', _debounce(move, 50));
    }
  }

  ;
  init();
};

var rating = function rating() {
  var container = document.querySelector('.rating');

  if (container) {
    var items = container.querySelectorAll('.rating__item');

    container.onclick = function (e) {
      if (!e.target.classList.contains('is-active')) {
        items.forEach(function (item) {
          item.classList.remove('is-active');
        });
        e.target.classList.add('is-active');
      }
    };
  }
};

var quantitySelector = function quantitySelector() {
  var quantitySelectors = document.querySelectorAll('.js-quantity-selector');

  if (quantitySelectors.length > 0) {
    quantitySelectors.forEach(function (quantitySelector) {
      quantitySelector.addEventListener('click', function (e) {
        if (e.target.classList.contains('quantity-selector__minus')) {
          var number = +quantitySelector.querySelector('.quantity-selector__value').textContent.replace('шт', '');
          var newNumber;

          if (number !== 1) {
            newNumber = number - 1;
          } else {
            return;
          }

          quantitySelector.querySelector('.quantity-selector__value').textContent = "".concat(newNumber, " \u0448\u0442");
        }

        if (e.target.classList.contains('quantity-selector__plus')) {
          var number = +quantitySelector.querySelector('.quantity-selector__value').textContent.replace('шт', '');
          var newNumber;
          newNumber = number + 1;
          quantitySelector.querySelector('.quantity-selector__value').textContent = "".concat(newNumber, " \u0448\u0442");
        }
      });
    });
  }
};

var burgerCategories = function burgerCategories() {
  document.querySelector('.js-burger-menu').addEventListener('click', function (e) {
    if (e.target.closest('.categories-burger-menu__header')) {
      e.target.closest('.categories-burger-menu').classList.toggle('is-opened');
    }
  });
};

var sortingSelect = function sortingSelect() {
  var selectors = document.querySelectorAll('.js-sorting-select');

  if (selectors.length > 0) {
    selectors.forEach(function (selector) {
      selector.addEventListener('click', function (e) {
        if (e.target.classList.contains('sorting__item')) {
          e.target.closest('.sorting__list').querySelector('.is-active').classList.remove('is-active');
          e.target.classList.add('is-active');
        }
      });
    });
  }
};

var categories = function categories() {
  var botHeaderList = document.querySelector('.menu-bot-header__list');
  var submenuParent = document.querySelector('.menu-bot-header__content');
  var allSubmenus = submenuParent.querySelectorAll('.catalog-nav');
  var allSubmenuLinks = botHeaderList.querySelectorAll('.menu-bot-header__link');
  botHeaderList.addEventListener('click', function (e) {
    if (e.target.classList.contains('menu-bot-header__link')) {
      e.preventDefault();
      var targetSubmenuId = e.target.getAttribute('href');
      var targetSubmenuObject = submenuParent.querySelector("".concat(targetSubmenuId));

      if (targetSubmenuObject.classList.contains('is-shown')) {
        e.target.classList.remove('is-active');
        targetSubmenuObject.classList.remove('is-shown');
      } else {
        allSubmenuLinks.forEach(function (el) {
          el.classList.remove('is-active');
        });
        allSubmenus.forEach(function (el) {
          el.classList.remove('is-shown');
        });
        setTimeout(function () {
          e.target.classList.add('is-active');
          targetSubmenuObject.classList.add('is-shown');
        }, 100);
      }
    }
  });
  document.querySelector('body').addEventListener('click', function (e) {
    var openedCategory = document.querySelector('.catalog-nav.is-shown');
    var activeLink = document.querySelector('.menu-bot-header__link.is-active');

    if (openedCategory) {
      if (!e.target.closest('.catalog-nav') && !e.target.classList.contains('menu-bot-header__link')) {
        openedCategory.classList.remove('is-shown');
        activeLink.classList.remove('is-active');
      }
    }
  });
};

var selectors = function selectors() {
  document.querySelectorAll('.selector').forEach(function (select) {
    var selectCurrent = select.querySelector('.selector__current'),
        selectList = select.querySelector('.selector__options'),
        selectInput = select.querySelector('.selector__input'),
        selectItem = select.querySelectorAll('.selector__option');
    selectCurrent.addEventListener('click', function () {
      selectList.closest('.selector').classList.toggle('is-shown');
    });
    selectItem.forEach(function (item) {
      item.addEventListener('click', function () {
        var itemValue = item.getAttribute('data-value');
        var itemText = item.textContent;
        selectInput.value = itemValue;
        selectCurrent.textContent = itemText;
        selectListHide();

        if (select.nextElementSibling.querySelector('button')) {
          if (select.nextElementSibling.querySelector('button').disabled) {
            select.nextElementSibling.querySelector('button').disabled = false;
            return;
          }
        }
      });
    });

    var selectListHide = function selectListHide() {
      selectList.closest('.selector').classList.remove('is-shown');
    };

    document.addEventListener('mouseup', function (e) {
      if (!select.contains(e.target)) selectListHide();
    });
  });
};

var threeDotsMenu = function threeDotsMenu() {
  var threeDotsBtn = document.querySelector('.three-dots__btn');
  var threeDotsBody = document.querySelector('.js-three-dots-body');

  if (threeDotsBody) {
    threeDotsBtn.addEventListener('click', function () {
      threeDotsBody.classList.toggle('is-shown');
    });
  }

  document.querySelector('body').addEventListener('click', function (e) {
    if (!e.target.closest('.three-dots__body') && !e.target.closest('.three-dots__btn')) {
      threeDotsBody.classList.remove('is-shown');
    }
  });
};

var catalogueMenu = function catalogueMenu() {
  document.querySelector('.js-catalogue-btn').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('.catalogue__body').classList.toggle('is-opened');
  });
};

var cartToggle = function cartToggle() {
  document.querySelector('.js-cart-btn').addEventListener('click', function () {
    document.querySelector('.cart').classList.toggle('is-opened');
  });
  document.querySelector('body').addEventListener('click', function (e) {
    if (e.target.closest('.js-cart-btn')) return;

    if (!e.target.closest('.cart')) {
      document.querySelector('.cart').classList.remove('is-opened');
    }
  });
};

var searchInput = function searchInput() {
  var searchbar = document.querySelector('.searchbar__input');

  if (searchbar) {
    searchbar.addEventListener('keyup', function (e) {
      if (e.target.value.length > 2) {
        document.querySelector('.search-tip').classList.add('is-shown');
      } else {
        document.querySelector('.search-tip').classList.remove('is-shown');
      }
    });
    searchbar.addEventListener('blur', function (e) {
      if (e.target.value.length > 2) {
        document.querySelector('.search-tip').classList.remove('is-shown');
      }
    });
    searchbar.addEventListener('focus', function (e) {
      if (e.target.value.length > 2) {
        document.querySelector('.search-tip').classList.add('is-shown');
      }
    });
  }
};

var sliders = function sliders() {
  var sliderBanner = new Swiper('.banner-slider__container', {
    pagination: {
      el: '.banner-slider__pagination'
    },
    spaceBetween: 100,
    slidesPerView: 1
  });
  var sliderPartners = new Swiper('.footer-slider__container', {
    spaceBetween: 5,
    slidesPerView: 1,
    loop: true,
    navigation: {
      nextEl: '.footer-slider__button--next',
      prevEl: '.footer-slider__button--prev'
    },
    breakpoints: {
      850: {
        slidesPerView: 4
      },
      900: {
        slidesPerView: 7
      }
    }
  });
};

document.addEventListener("DOMContentLoaded", function () {
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
  yandexMaps();
  svg4everybody();
});