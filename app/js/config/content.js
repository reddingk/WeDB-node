(function(){
  'use strict';

  angular
    .module('dataconfig')
    .service('weInfo', [ 'WEData', '$filter','movieServices', 'tvServices', function MCEInfo(WEData, $filter, movieServices, tvServices){
      var blogs = WEData.siteData.blogs;

      function getAllMovieTvCredits(item, list, callback){
        var objectMT = list[item];
        if(Object.keys(objectMT.credits).length == 0){
          if(objectMT.details.type == 'movie'){
            movieServices.credits(objectMT.id, function(res) {
              list[item].credits = res;
              if((item-1) < 0) {
                callback(list);
              }
              else {
                getAllMovieTvCredits(item-1, list, callback);
              }
            });
          }
          else if(objectMT.details.type == 'tv'){
            tvServices.credits(objectMT.id, function(res) {
              list[item].credits = res;
              if((item-1) < 0) { callback(list); }
              else { getAllMovieTvCredits(item-1, list, callback);}
            });
          }
        }
        else {
          if((item-1) < 0) { callback(list); }
          else { getAllMovieTvCredits(item-1, list, callback);}
        }
      }

      return {
        blogs: {
          all: function(){
            return blogs;
          },
          latest: function() {
            return blogs[blogs.length -1];
          }
        },
        search: {
          all: function(query, callback) {
            movieServices.anyItem(query, function(res) { callback(res); } );
          },
          movies:  {
            byName: function(query, callback) {
              movieServices.names(query, function(res) { callback(res); } );
            },
            byId: function(id, callback){
              movieServices.info(id, function(res) { callback(res); } );
            },
            credits: function(id, callback){
              movieServices.credits(id, function(res) { callback(res); } );
            },
            suggestions: function(id, callback){
              movieServices.similar(id, function(res) { callback(res); } );
            }
          },
          tv: {
            byName: function(query, callback){
              tvServices.names(query, function(res) { callback(res); } );
            },
            byId: function(id, callback){
              tvServices.info(id, function(res) { callback(res); } );
            },
            credits: function(id, callback){
              tvServices.credits(id, function(res) { callback(res); } );
            },
            suggestions: function(id, callback){
              tvServices.similar(id, function(res) { callback(res); } );
            }
          },
          movies_Tv: {
            byName: function(query, callback){
              movieServices.anyItem(query, function(res) {
                var combo = [];
                var results = res.results;
                for(var i =0; i < results.length; i++)
                {
                  if((results[i].media_type == "movie") || (results[i].media_type == "tv"))
                  {
                    combo.push(results[i]);
                  }
                }
                if(combo.length < 15)
                {
                  // Get 2nd page and add results to combo
                  callback(combo);
                }
                else { callback(combo);}

              });

            }
          }
        },
        compare: {
          movieTv: function(compareList, callback){
            getAllMovieTvCredits(compareList.length-1, compareList, function(res){
              var tmpResults = {"moviestv":[], "cast":[], "crew":[], "castACrew":[]};

              for(var i=0; i < res.length; i++){
                tmpResults.moviestv.push({"id":res[i].id, "title":(res[i].details.type == 'movie'? res[i].details.title : res[i].details.name), "image_path":res[i].details.poster_path, "media_type":res[i].details.type});

                var castCrewList = res[i].credits.cast.concat(res[i].credits.crew);
                // Add Cast & Crew
                for(var j=0; j < castCrewList.length; j++){
                  var added = false;
                  for(var k=0; k < tmpResults.castACrew.length; k++){
                    if(castCrewList[j].id == tmpResults.castACrew[k].id) {
                      tmpResults.castACrew[k].MTIDS.push(res[i].id);
                      added = true;
                      break;
                    }
                  }
                  if(!added) {
                    var tmpCast = {"id":castCrewList[j].id, "name":castCrewList[j].name, "image_path":castCrewList[j].profile_path, "MTIDS":[res[i].id]};
                    tmpResults.castACrew.push(tmpCast);
                  }
                }

              }

              callback(tmpResults);
            });
          }
        }
      }
    }])
    .factory("WEData", ['$q', '$http', function($q, $http){
     function WeInfoData() {
       var vm = this;
       vm.siteData = {
         blogs: [{"title":"From The Wild To The West", "images":["http://www.impawards.com/2016/posters/tarzan_ver3_xlg.jpg", "http://questionablefilmreview.files.wordpress.com/2013/07/7736093674_2e8414a35c_o.jpg","https://i.jeded.com/i/django-unchained.6897.jpg"], "text":"Whose headed to purchase @legendoftarzan available on blu-Ray and DVD TODAY!!! We wanted to find a #wedbconnection and we found one with one of our all time favorite actors @samuelljackson and co-star #ChristophWaltz This will be third time the pair have joined eachother for a big screen production! First in 2009 when Sam narrated for the film #IngloriousBasterds starring #BradPitt then again when the both graced the screen in the unique #QuentinTarantino film #DjangoUnchained starring the multitalented @iamjamiefoxx to their most recent action film to hit theaters @legendoftarzan a definite must see starring another one of our favorite actresses @margotrobbie as Jane and #AlexanderSkarsgard as Tarzan! With his incredible range and amazingly diverse talents we can't wait to see what @samuelljackson will do next! #SamuelLJackson #ChristophWaltz #MargotRobbie #AlexanderSkarsgard #JamieFoxx #BradPitt #IngloriousBasterds #DjangoUnchained #LegendOfTarzan #wedbconnection"}]
       };
     }

     return new WeInfoData();
    }]);

})();
