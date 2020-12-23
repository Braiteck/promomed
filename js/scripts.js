$(() => {
	// Главная страница
	var oneScrllBagFix = false

	if ($('.one_page').length) {
		$('.one_page').onepage_scroll({
			sectionContainer: '.one_page section',
			easing: 'linear',
			animationTime: 500,
			pagination: false,
			updateURL: false,
			loop: false,
			keyboard: true,
			responsiveFallback: 1379,
			direction: 'vertical',
			beforeMove: index => {
				if (oneScrllBagFix) { return false }

				oneScrllBagFix = true

				index == 4 || index == 5
					? $('header').addClass('fixed')
					: $('header').removeClass('fixed')
			},
			afterMove: index => {
				oneScrllBagFix = false
			}
		})
	}


	// Товары
	$('.products .slider').owlCarousel({
		margin: 1,
		nav: true,
		dots: false,
		loop: false,
		mouseDrag: false,
		smartSpeed: 500,
		responsive: {
			0: {
				items: 1
			},
			480: {
				items: 2
			},
			768: {
				items: 3
			},
			1280: {
				items: 4
			}
		},
		onInitialized: event => {
			productHeight($(event.target), $(event.target).find('.product').length)
		},
		onResized: event => {
			productHeight($(event.target), $(event.target).find('.product').length)
		}
	})


	// Статьи - слайдер
	$('.articles .slider').owlCarousel({
		margin: 1,
		nav: true,
		dots: false,
		loop: true,
		items: 1,
		smartSpeed: 750
	})


	// Аккордион
	$('body').on('click', '.accordion .item .head', function (e) {
		e.preventDefault()

		const $item = $(this).closest('.item'),
			$accordion = $(this).closest('.accordion')

		if ($item.hasClass('active')) {
			$item.removeClass('active').find('.data').slideUp(300)
		} else {
			$accordion.find('.item').removeClass('active')
			$accordion.find('.data').slideUp(300)

			$item.addClass('active').find('.data').slideDown(300)
		}
	})


	// Моб. меню
	$('header .mob_menu_btn').click((e) => {
		e.preventDefault()

		if (!$('header .mob_menu_btn').hasClass('active')) {
			$('header .mob_menu_btn').addClass('active')
			$('body').addClass('menu_open')
			$('header .menu').fadeIn(300)
		} else {
			$('header .mob_menu_btn').removeClass('active')
			$('body').removeClass('menu_open')
			$('header .menu').fadeOut(200)
		}
	})

	if (is_touch_device()) {
		// Закрываем меню при клике за её пределами
		$(document).click((e) => {
			if ($(e.target).closest('header').length == 0) {
				$('header .mob_menu_btn').removeClass('active')
				$('body').removeClass('menu_open')
				$('header .menu').fadeOut(200)
			}
		})
	}
})



$(window).on('load', () => {
	// Фикс. шапка
	setTimeout(() => {
		headerInit = true,
			headerHeight = $('header').outerHeight()

		$('header:not(.absolute)').wrap('<div class="header_wrap"></div>')
		$('.header_wrap').height(headerHeight)

		headerInit && $(window).scrollTop() > 0
			? $('header').addClass('fixed')
			: $('header').removeClass('fixed')
	})


	// Статьи - сетка
	let articles = $('.articles .row'),
		articlesGutter = parseInt(articles.css('--articles_gutter'))

	masonry = articles.masonry({
		percentPosition: true,
		gutter: articlesGutter,
		itemSelector: '.article',
		columnWidth: articles.find('.article').width()
	})


	// Parallax
	if (!is_touch_device()) {
		if ($('#parallax1').length) {
			let scene1 = document.getElementById('parallax1'),
				parallax = new Parallax(scene1)
		}

		if ($('#parallax2').length) {
			let scene2 = document.getElementById('parallax2'),
				parallax = new Parallax(scene2)
		}
	}


	// Товары
	window.matchMedia('(max-width: 1023px)').matches
		? $('.products .desktop_list').removeClass('list').addClass('row')
		: $('.products .desktop_list').removeClass('row').addClass('list')
})



$(window).resize(() => {
	// Фикс. шапка
	headerInit = false
	$('.header_wrap').height('auto')

	setTimeout(() => {
		headerInit = true
		headerHeight = $('header').outerHeight()

		$('.header_wrap').height(headerHeight)

		headerInit && $(window).scrollTop() > 0
			? $('header').addClass('fixed')
			: $('header').removeClass('fixed')
	}, 100)


	// Товары
	window.matchMedia('(max-width: 1023px)').matches
		? $('.products .desktop_list').removeClass('list').addClass('row')
		: $('.products .desktop_list').removeClass('row').addClass('list')
})



$(window).scroll(() => {
	// Фикс. шапка
	typeof headerInit !== 'undefined' && headerInit && $(window).scrollTop() > 0
		? $('header').addClass('fixed')
		: $('header').removeClass('fixed')
})



$(window).on('load', () => {
	// Выравнивание элементов в сетке
	$('.products .row').each(function () {
		productHeight($(this), parseInt($(this).css('--products_count')))
	})
})



$(window).resize(() => {
	// Выравнивание элементов в сетке
	$('.products .row').each(function () {
		productHeight($(this), parseInt($(this).css('--products_count')))
	})
})



// Выравнивание товаров
function productHeight(context, step) {
	let start = 0,
		finish = step,
		$products = context.find('.product')

	$products.find('.name, .desc').height('auto')

	$products.each(function () {
		setHeight($products.slice(start, finish).find('.name'))
		setHeight($products.slice(start, finish).find('.desc'))

		start = start + step
		finish = finish + step
	})
}