chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		// ----------------------------------------------------------

		var links = [
			'nyheternasverige.se',
			'vindoegat.se',
			'storkensnyheter.se',
			'thestatelyharold.com',
			'theportlygazelle.com',
			'denfriakarolinen.se',
			'inzoomat.se',
			'worldnewsdailyreport.com',
			'dailycurrant.com',
			'newsthump.com',
			'mogul.ws',
			'pakistantoday.com.pk/author/khabaristantoday',
			'hantisverige.wordpress.com',
			'satiren.se',
			'dailybuzzlive.com',
			'huzlers.com',
			'speisa.com',
			'nationalreport.net',
			'callthecops.net',
			'carbolicsmoke.com',
			'svenskbladet.se',
			'theonion.com',
			'gronkoping.nu',
			'en.mediamass.net',
			'lightlybraisedturnip.com',
			'newyorker.com/online/blogs/borowitzreport',
			'thedailymash.co.uk',
			'mrconservative.com',
			'newsbiscuit.com',
			'sundsvallsbladet.se',
			'waterfordwhispersnews.com',
			'rokokoposten.dk',
			'heltnormalt.no',
			'viralshoot.se',
			'mysigast.se',
			'viralking.se',
			'nordpresse.be',
			'amplifyinglass.com',
			'avantnews.com',
			'borowitzreport.com',
			'jamstalldhetsfeministern.wordpress.com',
			'koling.nu',
			'riktigtsjukt.se',
			"abcnews.com.co",
			"nbcnews.com.co",
			"beforeitsnews.com",
			"enduringvision.com"


		];

		function linkWarning() {
			$.each(links, function(index, url) {
				var badLink = 'a[href*="' + url + '"]';
				$(badLink).each(function() {
					$(this).addClass('hint--error hint--large');
					$(this).attr('aria-label', 'Den här webbsidan finns på Viralgranskarens varningslista. Klicka för att läsa varför!');
					$(this).on('click', function() {
						window.open("http://touch.metro.se/nyheter/viralgranskarens-varningslista/EVHnfy!7M3vaeeacrHw2/","mywindow","menubar=1,resizable=1,width=450,height=650");
					});
				});
			});
		};
		linkWarning();

		$(window).scroll(function() {
			linkWarning();
		});
	}

}, 5);

$('.hint--error').on('click', function() {
	window.open("http://touch.metro.se/nyheter/viralgranskarens-varningslista/EVHnfy!7M3vaeeacrHw2/");
});

});
