const deepClone = require('just-clone')

const {
  player,
  playSong,
  addSong,
  createPlaylist,
  editPlaylist,
  playPlaylist,
  playlistDuration,
  removePlaylist,
  removeSong,
  searchByDuration,
  searchByQuery,
} = require('../index')

const mockSong1 = {
  id: 5,
  title: 'As a Stone',
  album: 'Show Us What You Got',
  artist: 'Full Trunk',
  duration: 259,
}
const mockSong2 = {
  id: 1,
  title: 'All is One',
  album: 'All is One',
  artist: 'Orphaned Land',
  duration: 270,
}
const mockSong3 = {
  id: 6,
  title: 'Vortex',
  album: 'Wallflowers',
  artist: 'Jinjer',
  duration: 242,
}
const mockSong4 = {
  id: 4,
  title: 'Thunderstruck',
  album: 'The Razors Edge',
  artist: 'AC/DC',
  duration: 292,
}
const mockPlaylist1 = {
  id: 2,
  name: 'Israeli',
  songs: [mockSong1.id, mockSong2.id],
}
const mockPlaylist2 = { id: 3, name: 'Metal', songs: [mockSong1.id] }

const mockPlayer = {
  songs: [mockSong1, mockSong2, mockSong4],
  playlists: [mockPlaylist1],
}

const mockSong3Details = [
  mockSong3.title,
  mockSong3.album,
  mockSong3.artist,
  '04:02',
  mockSong3.id,
]
const mockPlaylist1Duration = mockSong1.duration + mockSong2.duration

const mockNonExistentSongId = 2
const mockNonExistentPlaylistId = 1

describe('Player Tests', () => {
  beforeEach(() => {
    player.songs = deepClone(mockPlayer.songs)
    player.playlists = deepClone(mockPlayer.playlists)
    jest.clearAllMocks()
  })

  it('playSong should console.log in the correct format', () => {
    const spy = jest.spyOn(console, 'log')
    playSong(mockSong1.id)
    expect(spy).toHaveBeenCalledWith(
      `Playing As a Stone from Show Us What You Got by Full Trunk | 04:19.`
    )
  })

  it('playSong should throw for non-existent ID', () => {
    expect(() => playSong(mockNonExistentSongId)).toThrow()
  })

  it('removeSong should remove the song from player', () => {
    removeSong(mockSong1.id)
    expect(player.songs).toEqual([mockSong2, mockSong4])
  })

  it('removeSong should remove the song from all playlists', () => {
    removeSong(mockSong1.id)
    expect(player.playlists[0].songs).toEqual([mockSong2.id])
  })

  it('removeSong should throw for non-existent ID', () => {
    expect(() => removeSong(mockNonExistentSongId)).toThrow()
  })

  it('addSong should add a new song to the player', () => {
    addSong(...mockSong3Details)
    expect(player.songs).toEqual([...mockPlayer.songs, mockSong3])
  })

  it('addSong should generate a new unique ID when it is not supplied', () => {
    const newSongId = addSong(...mockSong3Details.slice(0, -1))
    expect(newSongId).toBeDefined()
    expect(mockPlayer.songs.map(song => song.id).includes(newSongId)).toBe(false)
  })

  it('addSong should throw for an ID that is taken', () => {
    expect(() => addSong(...mockSong3Details.slice(0, -1), mockSong1.id)).toThrow()
  })

  it('removePlaylist should remove a playlist from the player', () => {
    removePlaylist(mockPlaylist1.id)
    expect(player.playlists.length).toBe(0)
  })

  it('removePlaylist should throw for non-existent ID', () => {
    expect(() => removePlaylist(mockNonExistentPlaylistId)).toThrow()
  })

  it('createPlaylist should add a new playlist to the player', () => {
    createPlaylist(mockPlaylist2.name, mockPlaylist2.id)
    expect(player.playlists).toEqual([
      mockPlaylist1,
      { ...mockPlaylist2, songs: [] },
    ])
  })

  it('createPlaylist should generate a new unique ID when it is not supplied', () => {
    const newPlaylistId = createPlaylist(mockPlaylist2.name)
    expect(newPlaylistId).toBeDefined()
    expect(mockPlayer.playlists.map(p => p.id).includes(newPlaylistId)).toBe(false)
  })

  it('createPlaylist should throw for an ID that is taken', () => {
    expect(() => createPlaylist(mockPlaylist2.name, mockPlaylist1.id)).toThrow()
  })

  it('playPlaylist should play all songs inside it', () => {
    const spy = jest.spyOn(console, 'log')
    playPlaylist(mockPlaylist1.id)
    expect(spy).toHaveBeenCalledTimes(mockPlaylist1.songs.length)
  })

  it('playPlaylist should throw for non-existent ID', () => {
    expect(() => playPlaylist(mockNonExistentPlaylistId)).toThrow()
  })

  it('editPlaylist should add a song to a playlist when it is not initially there', () => {
    editPlaylist(mockPlaylist1.id, mockSong4.id)
    expect(player.playlists[0].songs).toEqual([
      ...mockPlaylist1.songs,
      mockSong4.id,
    ])
  })

  it('editPlaylist should remove a song from a playlist when it was initially there', () => {
    editPlaylist(mockPlaylist1.id, mockSong1.id)
    expect(player.playlists[0].songs).toEqual([mockSong2.id])
  })

  it('editPlaylist should throw for non-existent playlist ID', () => {
    expect(() => editPlaylist(mockPlaylist2.id, mockSong1.id)).toThrow()
  })

  it('editPlaylist should throw for non-existent song ID', () => {
    expect(() => editPlaylist(mockPlaylist1.id, mockSong3.id)).toThrow()
  })

  it('editPlaylist should remove a playlist if it has been emptied of songs', () => {
    mockPlaylist1.songs.forEach((song) => editPlaylist(mockPlaylist1.id, song))
    expect(player.playlists.length).toBe(0)
  })

  it('playlistDuration should return the sum of durations of all songs inside it', () => {
    expect(playlistDuration(mockPlaylist1.id)).toBe(mockPlaylist1Duration)
  })

  it('searchByQuery should be case-insensitive', () => {
    expect(searchByQuery('t')).toEqual({
      songs: [mockSong1, mockSong4],
      playlists: [],
    })
  })

  it('searchByQuery should consider all song attributes, and sort results alphanumerically', () => {
    expect(searchByQuery('ll')).toEqual({
      songs: [mockSong2, mockSong1],
      playlists: [],
    })
  })

  it('searchByQuery should find matching playlists', () => {
    expect(searchByQuery('Israeli')).toEqual({
      songs: [],
      playlists: [mockPlaylist1],
    })
  })

  it('searchByDuration should find the closest song', () => {
    expect(searchByDuration('04:23')).toEqual(mockSong1)
    expect(searchByDuration('04:27')).toEqual(mockSong2)
  })

  it('searchByDuration should find the closest playlist', () => {
    expect(searchByDuration('10:00')).toEqual(mockPlaylist1)
  })
})