!!include('./partials/polyfills.js');
!!include('./partials/common.js');

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
	yandexMaps();
	svg4everybody();
});
