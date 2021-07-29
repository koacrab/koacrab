$(document).ready(function() {
		//SmothScroll
		$('a[href*=#]').click(function() {
			if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
			&& location.hostname == this.hostname) {
					var $target = $(this.hash);

          $target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
					if ($target.length) {
							var targetOffset = $target.offset().top;
							$('html,body').animate({scrollTop: targetOffset}, 600);
              $(this).css('text-decoration', 'none');

							return false;
					}
			}
		});

    //bodymovin control
    var resourceCards = document.querySelectorAll('.resource-block');
    var toolsCards = document.querySelectorAll('.tools-block');
    var len = resourceCards.length;
    var setBodymovin = function(cards, len){
        while (len--) {
            var bodymovinLayer = cards[len].getElementsByClassName('bodymovin')[0];

            var animData = {
                wrapper: bodymovinLayer,
                loop: false,
                prerender: true,
                autoplay: false,
                path: bodymovinLayer.getAttribute('data-movpath')
            };

            anim = bodymovin.loadAnimation(animData);

            (function(anim){
               var card = cards[len];
                $(card).on('mouseenter', function(){
                  anim.play();
                });

                $(card).on('mouseleave', function(e){
                  anim.stop();
                });

            })(anim);
        }
    }

    setBodymovin(resourceCards, len);
    setBodymovin(toolsCards, len);
});
