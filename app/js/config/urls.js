(function(){
  'use strict';

  angular
    .module('config')
    .factory('api', function(){
      var baseurl = "https://api.themoviedb.org/3/";
      var apikey = "8af02f398b3ff990bab4f71c247c640a";

      return {
        any: {
          all: function(query){
            return baseurl + "search/multi?api_key="+apikey+"&query="+query;
          },
          page: function(query, page){
            return baseurl + "search/multi?page="+page+"&api_key="+apikey+"&query="+query;
          }
        },
         movie: {
             searchname: function(query){
                 return baseurl + "search/movie?api_key="+apikey+"&query="+query;
             },
             searchName_Page: function(query, page){
                 return baseurl + "search/movie?api_key="+apikey+"&page="+ page +"&query="+query;
             },
             getMovieCredits: function(id) {
                 return baseurl + "movie/"+id+"/credits?api_key="+apikey;
             },
             getMovieInfo: function(id) {
                 return baseurl + "movie/"+id+"?api_key="+apikey;
             },
             getSimilarMovies: function(id) {
               return baseurl + "movie/"+id+"/similar?api_key="+apikey;
             },
             getNowPlaying: function(page) {
               return baseurl + "movie/now_playing?page="+page+"&api_key="+apikey;
             },
             getPopular: function(page) {
               return baseurl + "movie/popular?page="+page+"&api_key="+apikey;
             }
         },
         cast: {
             searchname: function(query) {
                 return  baseurl + "search/person?api_key="+apikey+"&query="+query;
             },
             searchName_Page: function(query, page){
                 return baseurl + "search/person?api_key="+apikey+"&page="+ page +"&query="+query;
             },
             getCombinedCredits: function(id) {
                 return baseurl + "person/"+id+"/combined_credits?api_key="+apikey;
             },
             getCastDetails: function(id) {
                 return baseurl + "person/"+id+"?api_key="+apikey;
             },
             getPopular: function(page) {
                 return baseurl + "person/popular?page="+page+"&api_key="+apikey;
             }
         },
         tv: {
             searchname: function(query){
                 return baseurl + "search/tv?api_key="+apikey+"&query="+query;
             },
             searchName_Page: function(query, page){
                 return baseurl + "search/tv?api_key="+apikey+"&page="+ page +"&query="+query;
             },
             getTvCredits: function(id) {
                 return baseurl + "tv/"+id+"/credits?api_key="+apikey;
             },
             getTvInfo: function(id) {
                 return baseurl + "tv/"+id+"?api_key="+apikey;
             },
             getSimilarTv: function(id) {
               return baseurl + "tv/"+id+"/similar?api_key="+apikey;
             },
             getOnAir: function(page) {
               return baseurl + "tv/on_the_air?page="+page+"&api_key="+apikey;
             }
         }
      }
    });

})();
