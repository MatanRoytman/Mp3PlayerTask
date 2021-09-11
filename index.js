const player = {
  songs: [
    {
      id: 1,
      title: 'Vortex',
      album: 'Wallflowers',
      artist: 'Jinjer',
      duration: 242,
    },
    {
      id: 2,
      title: 'Vinda',
      album: 'Godtfolk',
      artist: 'Songleikr',
      duration: 160,
    },
    {
      id: 7,
      title: 'Shiroyama',
      album: 'The Last Stand',
      artist: 'Sabaton',
      duration: 213,
    },
    {
      id: 3,
      title: 'Thunderstruck',
      album: 'The Razors Edge',
      artist: 'AC/DC',
      duration: 292,
    },
    {
      id: 4,
      title: 'All is One',
      album: 'All is One',
      artist: 'Orphaned Land',
      duration: 270,
    },
    {
      id: 5,
      title: 'As a Stone',
      album: 'Show Us What You Got',
      artist: 'Full Trunk',
      duration: 259,
    },
  ],
  playlists: [
    { id: 1, name: 'Metal', songs: [1, 7, 4] },
    { id: 5, name: 'Israeli', songs: [4, 5] },
  ],
  playSong(song) {
    console.log("Playing " + song.title + " from "+song.album + " by "+ song.artist + " | "+ time(Math.floor(song.duration/60)) + ":" +time(song.duration % 60)+".");
  },
}
function time(n){
  return n > 9 ? "" + n: "0" + n;
}

function mmssFormatToBigNumber(duration){
  const mm = duration[0] + duration[1];
  const ss = duration[3] + duration[4];
  return duration = mm*60 + +ss;
}


function playSong(id) {
  for (let index = 0; index < player.songs.length; index++) {
    if (id===player.songs[index].id){
      player.playSong(player.songs[index]);
      return;      
    }
  }
  throw new Error ("song not found");
}

function removeSong(id) {
  /*Gets a song ID. 
  Removes the song with the given ID from the player (from songs and playlists).*/
  let index = 0;
  for (index = 0; index < player.songs.length; index++) {
    if (id===player.songs[index].id) {
      player.songs.splice(index, 1);
      //console.log("SUCCESS delete: "+index);
      break;
    }
  }
  if (index === songs.length){
    throw new error("Song id not found.");
  }
  for (index = 0; index < player.playlists.length; index++){
    for (let index2 = 0; index2 < player.playlists[index].songs.length; index2++) {
      if (id==player.playlists[index].songs[index2]) {
        player.playlists[index].songs.splice(index2, 1);
        //console.log("SUCCESS delete: "+index+" "+index2);
        break;
      }
    }
  }
}

function addSong(title, album, artist, duration, id) {
  /* Gets a title, album, artist, duration & ID. Adds a new song with given properties to the player.
  The ID is optional, and if omitted should be automatically generated. 
  The song duration should be in mm:ss format (for example 06:27). 
  Returns the ID of the new song.*/
  let new_id = 0;
  if (id) {
    for (let index = 0; index < player.songs.length; index++) {
      if (id == player.songs[index].id ) {
        //console.log("ERROR: want to add song with same id");
        return -1;
      }     
    }
    new_id = id;
  }
  else {
    let max=1;
    for (let index = 0; index < player.songs.length; index++) {
      if(max < player.songs[index].id){
        max = player.songs[index].id;
      }
    }
    new_id = max + 1;
  }
  
  let newSong = {
    id: new_id,
    title: title,
    album: album,
    artist: artist,
    duration: mmssFormatToBigNumber(duration),
  } 
  player.songs.push(newSong);
  console.log("new song id: "+new_id);
  playSong(new_id);
  return new_id;
}
function removePlaylist(id) {
  /*Gets a playlist ID.
   Remove the playlist with the given ID from the player 
   (does not delete the songs inside it).*/
  for (let index = 0; index < player.playlists.length; index++) {
    if (id==player.playlists[index].id) {
      player.playlists.splice(index, 1)
      //console.log("SUCCESS delete playlist: "+index);
      break;
    }
  }
}
function createPlaylist(name, id) {
  /*Gets a name & ID. Creates a new, empty playlist with the given details.
   The ID is optional, and if omitted should be automatically generated.
   Returns the ID of the new playlist.*/
  let particular_id = 0;
  if (id) {
    for (let index = 0; index < player.playlists.length; index++) {
      if (id == player.playlists[index].id ) {
        console.log("ERROR: want to add playlist with same id");
        return -1;
      }     
    }
    particular_id = id;
  }
  else {
    let max=1;
    for (let index = 0; index < player.playlists.length; index++) {
      if(max < player.playlists[index].id){
        max = player.playlists[index].id;
      }
    }
    particular_id = max + 1;
  }
  let newPlaylist = {
    name : name,
    id : particular_id,
    songs: [],
  }
   player.playlists.push(newPlaylist);
   console.log("new playlist id: "+particular_id);
   console.log("playlist name: " + newPlaylist.name);
   return particular_id;

}
function playPlaylist(id) {
  /*Gets a playlist ID.
  Plays all songs in the specified playlist, in the order the appear in the playlist.*/
  for (let index = 0; index < player.playlists.length; index++) {
    if (id==player.playlists[index].id){
      for (let index2 = 0; index2 < player.playlists[index].songs.length; index2++) {
        playSong(player.playlists[index].songs[index2]); 
      }
    }
  }
}
function editPlaylist(playlistId, songId) {
  let songsList = [];
  let currentplaylist = { id: 0, name: '', songs: [0] };
  currentplaylist = null;
  /* Gets a playlist ID & a song ID.
  If the song ID exists in the playlist, removes it.
  If it was the only song in the playlist, also deletes the playlist.
  If the song ID does not exist in the playlist, adds it to the end of the playlist.*/
  let index;
  for (index = 0; index < player.playlists.length; index++) {
    if (playlistId==player.playlists[index].id) {
      currentplaylist = player.playlists[index];
      songsList = player.playlists[index].songs;
      //console.log ("find playlist number: "+playlistId);
      break;
    }
    if (index==player.playlists.length-1){
      throw new Error ("Not found playlist");
      return;
    }
  }
  for (let index2 = 0; index2 < songsList.length; index2++) {
    //console.log ("try to check songID: "+ songId + " with: " + songsList[index]);
    if (songId === songsList[index2]) {
      songsList.splice(index2, 1);
      //console.log("SUCCESS delete song from playlist: " + playlistId + "length: " + songsList.length);
      if (songsList.length===0) {
        //console.log("SUCCESS delete all playlist: "+ currentplaylist.id);
        player.playlists.splice(index,1);
      }
      return;
    }       
  }
  songsList.push(songId);
}
function playlistDuration(id) {
  /*Gets a playlist ID.
  Returns the total duration of the entire playlist with the given ID.*/
  let sum =0;
  let list=[];
  list=0;
  for (let index = 0; index < player.playlists.length; index++) {
    if (id==player.playlists[index].id){
      list=player.playlists[index].songs;
      //console.log("got the play list: "+index);
      break;
    }
  }
  if (list == 0){
    throw new Error("couldn't find the playlist");
    return;
  }
  for (let index = 0; index < player.songs.length; index++) {
    for (let index2 = 0; index2 < list.length; index2++) {
      if (player.songs[index].id==list[index2]){
        sum += player.songs[index].duration;
      }
    }
  }
  //console.log("Play list duraion: " + sum);
  return sum;
}
function searchByQuery(query) {
  /* Gets a query string. Returns a results object, which has:

  songs: an array of songs in which either title or album or artist contain the query string.
  The songs should be sorted by their titles.

  playlists: an array of playlists in which the name contains the query string.
  The playlists should be sorted by their names.
  The comparison in both cases should be case-insensitive.*/
  let resultObjectSong = [
    {
      id: 0,
      title: '',
      album: '',
      artist: '',
      duration: 0,
    },];
    resultObjectSong.pop();
  let resultObjectPlaylist =[
    { id: 0, name: '', songs: [0,1,2,3,4,5]},];
    resultObjectPlaylist.pop();
  for (let index = 0; index < player.songs.length; index++) {
    if (player.songs[index].title.includes(query)) {
      resultObjectSong.push(player.songs[index]);
    }
    else if (player.songs[index].album.includes(query)) {
      resultObjectSong.push(player.songs[index]); 
    }
    else if (player.songs[index].artist.includes(query)) {
      resultObjectSong.push(player.songs[index]); 
    }
    for (let index = 0; index < resultObjectSong.length; index++) {
     player.playSong(resultObjectSong[index])
    }
  }
  for (let index = 0; index < player.playlists.length; index++) {
    if (player.playlists[index].name) {
    }  
  }
}
function searchByDuration(duration) {
  /*Gets a duration in mm:ss format (for example 11:03).
  Returns the song, or playlist, with the closest duration to what was given.*/
  let time = mmssFormatToBigNumber(duration);
  let answer_song;
  let answer_playlist;
  if (player.songs[0]){
    answer_song=player.songs[0];
    for (let index = 1; index < player.songs.length; index++) {
      if (Math.abs(time-player.songs[index].duration)<Math.abs(time-answer_song.duration)){
        answer_song=player.songs[index];
      }
    }
  }
  if (player.playlists[0]){
    answer_playlist=player.playlists[0];
    for (let index = 1; index < player.playlists.length; index++) {
      if (Math.abs(time-playlistDuration(player.playlists[index].id))<Math.abs(time-playlistDuration(answer_playlist.id))){
        answer_playlist=player.playlists[index];
      }
    }
  }
  if (Math.abs(time-playlistDuration(answer_playlist.id))<Math.abs(time-answer_song.duration)){
    return answer_playlist;
  }
  else{
    return answer_song;
  }
}
module.exports = {
  player,
  playSong,
  removeSong,
  addSong,
  removePlaylist,
  createPlaylist,
  playPlaylist,
  editPlaylist,
  playlistDuration,
  searchByQuery,
  searchByDuration,
}