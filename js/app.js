/*
  GA SF JSD6
  Luke Eisenberg
  Please add all Javascript code to this file.
*/
'use strict';

$(document).ready(function () {

  $('#reddit').click(getRedditArticles);
  $('#hackerNews').click(getHackerNewsArticles);
  $('#techCrunch').click(getTechCrunchArticles);
  $('#closePopUp').click($('popUp').addClass('loader hidden'));

  $('#search').on('click', function() {
    $('#search').toggleClass('active')
  });

  $(".articleContent").on("click", "a", function(event) {
    event.preventDefault();
    $('#popUp').removeClass('hidden');
    $('#popUp > .container').empty();
    $('#popUp > .container').append($this.next('.container'));
    $('popUp').removeClass('loader');
  });

  function callApi(url, displayCallback) {
    $.ajax({
      url : url,
      dataType: "json",
      success: function(response) {
        console.log(response);
        return displayCallback(response);
      }
    });

  }

  function getRedditArticles() {
    var loader = $('#popUp').removeClass('hidden');
    var url = 'https://www.reddit.com/r/technology.json?jsonp=?';
    callApi(url, displayRedditArticles);
  }

  function displayRedditArticles(redditArticleObject)
  {
    var templateContextObject = parseRedditArticles(redditArticleObject);
    makePageElements(templateContextObject);
    var loader = $('#popUp').addClass('hidden');
  }

  function parseRedditArticles(redditArticleObject)
  {
    var articleArray = redditArticleObject.data.children;
    var templateContextObject = {};

    templateContextObject["articles"] = [];
    //Skip the first article in the array because its the subreddit info post
    for(var i = 1; i < articleArray.length; i++) {
      var thisArticle =  {}

      //Use reddit default thumbnail, r/Technology does not use thumbnails apparently
      thisArticle.pictureUrl = 'http://a.thumbs.redditmedia.com/0kVhB7E5deeOgVbr.png';
      thisArticle.articleUrl = articleArray[i]['data']['url'];
      thisArticle.title = articleArray[i]['data']['title'];
      thisArticle.votes = articleArray[i]['data']['score'];

      if (articleArray[i]['data']['link_flair_text']) {
        thisArticle.category = articleArray[i]['data']['link_flair_text'];
      }
      else {
        thisArticle.category = 'Technology';
      }

      templateContextObject["articles"].push(thisArticle);
    }

    return templateContextObject;

  }

  function getHackerNewsArticles() {
    var loader = $('#popUp').removeClass('hidden');
    var url = 'https://newsapi.org/v1/articles?source=hackernews&sortBy=top&apiKey=';
    callApi(url, displayNewsApiArticles);
  }

  function getTechCrunchArticles() {
    var loader = $('#popUp').removeClass('hidden');
    var url = 'https://newsapi.org/v1/articles?source=techcrunch&sortBy=top&apiKey=';
    callApi(url,displayNewsApiArticles);
  }

  function displayNewsApiArticles(newsApiArticleObject)
  {
    var templateContextObject = parseNewsApiArticles(newsApiArticleObject);
    makePageElements(templateContextObject);
    var loader = $('#popUp').addClass('hidden');
  }

  function parseNewsApiArticles(newsApiArticleObject)
  {
    var articleArray = newsApiArticleObject.articles;
    var templateContextObject = {};

    templateContextObject["articles"] = [];
    for(var i = 0; i < articleArray.length; i++)
    {
      var thisArticle =  {}

      if (articleArray[i]['urlToImage']) {
        thisArticle.pictureUrl = articleArray[i]['urlToImage'];
      }
      else {
        thisArticle.pictureUrl = 'https://cdn0.iconfinder.com/data/icons/seo-smart-pack/128/grey_new_seo-37-512.png';
      }
      thisArticle.articleUrl = articleArray[i]['url'];
      thisArticle.title = articleArray[i]['title'];
      thisArticle.votes = '';
      thisArticle.category = 'Technology';

      templateContextObject["articles"].push(thisArticle);
    }

    return templateContextObject;

  }

  function makePageElements(contextObject) {
    var source   = $("#article-template").html();
    var template = Handlebars.compile(source);
    var compiledHtml = template(contextObject);
    $('#main').html(compiledHtml);
  }

});
