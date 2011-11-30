$(function(){

  var yearDays = [
                 [ 360, 365 ],
                 [ 353, 358 ],
                 [ 346, 351 ],
                 [ 339, 344 ],
                 [ 332, 337 ],
                 [ 325, 330 ],
                 [ 318, 323 ],
                 [ 311, 316 ],
                 [ 304, 309 ],
                 [ 297, 302 ],
                 [ 290, 295 ],
                 [ 283, 288 ],
                 [ 276, 281 ],
                 [ 269, 274 ],
                 [ 262, 267 ],
                 [ 255, 260 ],
                 [ 248, 253 ],
                 [ 241, 246 ]
                 ]; 
  function getDayOfYear(d) {   // d is a Date object
    var yn = d.getFullYear();
    var mn = d.getMonth();
    var dn = d.getDate();
    var d1 = new Date(yn,0,1,12,0,0); // noon on Jan. 1
    var d2 = new Date(yn,mn,dn,12,0,0); // noon on input date
    var ddiff = Math.round((d2-d1)/864e5);
    return ddiff+1; 
  }

  function inRange(dayOfYear) {
    
    for (var i = 0; i < yearDays.length; i++) {
      if (yearDays[i][0] <= dayOfYear && dayOfYear <= yearDays[i][1])
        return i;
    }
    return -1;
  }

  $("form").submit(function() {

    if ($("#weeks_of_tweets").data('loading') == true)
      return;


    var q = $("#search_q").val();
    if (q == "")
      return false;
    
    var url = "/searches";

    $.post(url, { '_method': 'put',  'q': q }, function(r, s) {}, 'text');

    var tweetWeeks = new Array(18);
    for (var i = 0; i < tweetWeeks.length; i++) {
      tweetWeeks[i] = new Array();
    }

    $("#weeks_of_tweets").empty().data('loading', true);

    try {

      // Search for Nitrodist
      twitterlib.timeline(q, { filter: '#CM2066' }, function (tweets, options) {
        $.each(tweets, function(i, tweet) {
          var day = getDayOfYear(new Date(Date.parse(tweet.created_at)));
          var position = inRange(day);
          if (position !== -1) {
            tweetWeeks[position].push(tweet);
          }
        });

        $("#weeks_of_tweets").empty().data('loading', false);

        // with our other data structure
        $.each(tweetWeeks, function(i, tweetsForWeek) {
          $("#weeks_of_tweets").append("<li>" + 
                                       "<div class='toggle_parent'>" + 
                                       "<h3 class='indent float_left'>Week " + (tweetWeeks.length - i) + "</h3>" + 
                                       "<p class='tweet_week_count'>Tweets: <strong>" + tweetsForWeek.length + "</strong></p>" + 
                                       "</div>" + 
                                       "<ul id=\"tweet_list_" + i + "\" class='tweet_list clear'></ul></li>");
          $.each(tweetsForWeek, function(j, ttweet) {
            $("#tweet_list_" + i).append(twitterlib.render(ttweet));
          });
        });
        $("#weeks_of_tweets > li .toggle_parent").css('cursor', 'pointer').click(function () {
          $(".tweet_list", $(this).parent()).toggle('slow');
        });
      });
    }
    catch (ex) {
        $("#weeks_of_tweets").empty().data('loading', false);
        alert(ex.description);
    }

    return false; // stop form from submitting.
  });

});
