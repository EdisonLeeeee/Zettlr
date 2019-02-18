const ZettlrCommand = require('./zettlr-command')
const { trans } = require('../../common/lang/i18n')

class DirNew extends ZettlrCommand {
  constructor (app) {
    super(app, 'dir-new')
  }

  /**
    * Create a new directory.
    * @param  {Object} arg An object containing hash of containing and name of new dir.
    */
  run (arg) {
    let dir = null
    let curdir = null

    if (arg.hasOwnProperty('hash')) {
      curdir = this._app.findDir({ 'hash': parseInt(arg.hash) })
    } else {
      curdir = this._app.getCurrentDir()
    }

    try {
      dir = curdir.newdir(arg.name)
    } catch (e) {
      return this._app.window.prompt({
        type: 'error',
        title: trans('system.error.could_not_create_dir'),
        message: e.message
      })
    }

    // Re-render the directories, and then as well the file-list of the
    // current folder.
    this._app.ipc.send('paths-update', this._app.getPathDummies())

    // Switch to newly created directory.
    this._app.setCurrentDir(dir)
  }
}

module.exports = DirNew