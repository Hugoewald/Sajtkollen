// declare variables
var currentSite = [],
    currentUrl = window.location.hostname,
    data = [],
    dataType = '',
    expanded = [],
    firstLoad = true,
    shorts = [],
    siteId = '',
    toExpand = [],
    warnMessage = '';

// asynchronous loading function
function asynch(thisFunc, callback) {
  setTimeout(function() {
    thisFunc();
    if (typeof callback === 'function') {callback();}
  }, 10);
}

// json validation function
function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

// grab data from background
chrome.runtime.sendMessage(null, {"operation": "passData"}, null, function(state) {
  data = state.sites;
  shorts = state.shorteners;
});

// execute on load
chrome.extension.sendMessage({}, function(response) {
    $(document).ready(function() {
        // identify current site
        function idSite() {
          // currentSite looks for the currentUrl (window.location.hostname) in the JSON data file
          if (self === top) {
            currentSite = $.map(data, function(id, obj) {
              if (currentUrl === id.url || currentUrl === 'www.' + id.url) return id;
            });

            if (currentSite.length > 0 && (currentUrl == currentSite[0].url || currentUrl == 'www.' + currentSite[0].url)) {
              siteId = 'badlink';
              dataType = currentSite[0].type;
            } else {
              switch(currentUrl) {
                case 'www.facebook.com':
                  siteId = 'facebook';
                  break;
                case 'twitter.com':
                  siteId = 'facebook';
                  break;
                case currentSite:
                  siteId = 'badlink';
                  break;
                default:
                  siteId = 'none';
                  break;
              }
            }
          }
        }

        // expand short urls and append to anchor tags
        function expandLinks() {
          function getLinks() {
            $.each(shorts, function() {
              var shortLink = 'a[href*="' + this + '"]';
              $(shortLink).each(function() {
                var theLink = ($(this).attr('href'));
                toExpand.push(theLink);
              });
            });
          }

          function processLinks() {
            if (toExpand) {
              console.log('url array: ' + toExpand);
              chrome.runtime.sendMessage(null, {"operation": "expandLinks", "shortLinks": toExpand.toString()}, null, function(response) {
                console.log(response);
                if (isJson(response)) {
                  expanded = JSON.parse(response);
                  $.each(expanded, function(key, value) {
                    $('a[href="' + value.requestedURL + '"]').attr('longurl', value.resolvedURL);
                  });
                } else {
                 console.log('BS Detector could not expand shortened link');
                 console.log(response);
                }
              });
            }
          }

          asynch(getLinks, processLinks);
        }

        // generate warning message for a given url
        function warningMsg() {
          var classType = '';
          switch (dataType) {
            case 'bias':
              classType = 'Extreme Bias';
              break;
            case 'conspiracy':
              classType = 'Conspiracy Theory';
              break;
            case 'fake':
              classType = 'Fake News';
              break;
            case 'junksci':
              classType = 'Junk Science';
              break;
            case 'rumors':
              classType = 'Rumor Mill';
              break;
            case 'satire':
              classType = 'Satire';
              break;
            case 'state':
              classType = 'State News Source';
              break;
            case 'hate':
              classType = 'Hate Group';
              break;
            case 'test':
              classType = 'The Self Agency: Makers of the B.S. Detector';
              break;
              case 'test2':
                classType = 'The Self Agency: Makers of the B.S. Detector';
                break;
            default:
              classType = 'Classification Pending';
              break;
          }
          if (dataType != 'test') {
            warnMessage = '<img src="https://pbs.twimg.com/profile_images/458552179373010946/yw0-Od9d_400x400.png" /> &nbsp; Den här webbsidan finns på Viralgranskarens varningslista.';
          } else {
            warnMessage = classType;
          }
          if (dataType != 'test2') {
            warnMessage2 = 'Den här webbsidan finns på Viralgranskarens varningslista.';
          } else {
            warnMessage2 = classType;
          }
        }

        // flag entire site
        function flagSite() {
          warningMsg();
          $('body').addClass('shift');
          $('body').prepend('<div class="bs-alert"></div>');
          $('.bs-alert').append('<p>' + warnMessage + '</p>');
        }

        // flag links fb/twitter
        function flagIt() {
          if (!badLinkWrapper.hasClass('fFlagged')) {
            badLinkWrapper.before('<div class="bs-alert-inline">' + warnMessage + '</div>');
            badLinkWrapper.addClass('fFlagged');
          }
        }

        // generate link warnings
        function linkWarning() {
          $.each(data, function() {
            if (currentUrl != this.url) {
              var badLink = '[href*="' + this.url + '"],[data-expanded-url*="' + this.url +'"],[longurl*="' + this.url +'"]';
              dataType = this.type;
              warningMsg();
            }

            switch(siteId) {
              case 'badlink':
                $(badLink).each(function() {
                if ($(this).attr('is-bs') != 'true' && $(this).attr('href').indexOf(currentSite[0].url) < 0) {
                $(this).prepend('<img src="https://pbs.twimg.com/profile_images/458552179373010946/yw0-Od9d_400x400.png" width=20px height=20px /> &nbsp;');
                 $(this).addClass("hint--error hint--large hint--top");
                $(this).attr('aria-label', warnMessage2);
                $(this).on('click', function() {
				window.open("http://touch.metro.se/nyheter/viralgranskarens-varningslista/EVHnfy!7M3vaeeacrHw2/","mywindow",'_blank');
});
                $(this).attr('is-bs', 'true');
                }
                });
                break;
              case 'none':
                $(badLink).each(function() {
                if ($(this).attr('is-bs') != 'true') {
                $(this).prepend('<img src="https://pbs.twimg.com/profile_images/458552179373010946/yw0-Od9d_400x400.png" width=20px height=20px/> &nbsp;');
                $(this).addClass("hint--error hint--large hint--top");
                $(this).attr('aria-label', warnMessage2);
                $(this).on('click', function() {
				window.open("http://touch.metro.se/nyheter/viralgranskarens-varningslista/EVHnfy!7M3vaeeacrHw2/",'_blank');
});
                $(this).attr('is-bs', 'true');
                }
                });
                break;
              case 'facebook':
                var testLink = decodeURIComponent(this).substring(0, 30);
                if (testLink === 'https://l.facebook.com/l.php?u=') {
                  thisUrl = decodeURIComponent(this).substring(30).split('&h=', 1);
                  $(this).attr('longurl', thisUrl);
                }
                $(badLink).each(function() {
                  if ($(this).parents('._1dwg').length == 1) {
                    badLinkWrapper = $(this).closest('.mtm');
                    flagIt();
                  }
                  if ($(this).parents('.UFICommentContent').length == 1) {
                    badLinkWrapper = $(this).closest('.UFICommentBody');
                    flagIt();
                  }
                });
                break;
              case 'twitter':
                $(badLink).each(function() {
                  if ($(this).parents('.tweet').length == 1) {
                    badLinkWrapper = $(this).closest('.js-tweet-text-container');
                    flagIt();
                  }
                });
                break;
            }
          });

          firstLoad = false;
        }

        // execution script
        function trigger(mutations) {
          if (firstLoad) {
            idSite();
            if (siteId === 'badlink') {
              flagSite();
            }
          }

          if (arguments.length === 0) {
            mutationObserver.disconnect();
            linkWarning();
            mutationObserver.observe(targetNode, observerConfig);
            return;
          }
          var hasDesired = false, i = mutations.length, nodes, j;
          mutationObserver.disconnect();

          nloop: while (i--) {
            switch (mutations[i].type) {
              case 'childList':
                nodes = mutations[i].addedNodes;
                j = nodes.length;
                while (j--) if (nodes[j].nodeName.toLowerCase() === 'a') {
                  hasDesired = true;
                  break nloop;
                }
                break;
              case 'attributes':
                if (mutations[i].target.nodeName.toLowerCase() === 'a' &&
                    mutations[i].attributeName.toLowerCase() === 'href') {
                  hasDesired = true;
                  break nloop;
                }
                break;
              default:
                break;
            }
          }
          if (hasDesired) linkWarning();
          mutationObserver.observe(targetNode, observerConfig);
        }

        // watch page for changes
        var mutationObserver = new MutationObserver(trigger);
        var targetNode = document.body;
        var observerConfig = {
          attributes: true,
          childList: true,
          subtree: true
        };
        mutationObserver.observe(targetNode, observerConfig);
        $('badLink').on('click', function() {
        	window.open("http://touch.metro.se/nyheter/viralgranskarens-varningslista/EVHnfy!7M3vaeeacrHw2/",'_blank');
         });
        // execute
        trigger();
    });
});
