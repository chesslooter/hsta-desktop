const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')


describe('Application launch', function() {
    this.timeout(10000)

    beforeEach(function() {
        this.app = new Application({
            path: electronPath,
            args: [path.join(__dirname, '..')]
        })
        return this.app.start()
    })

    afterEach(function() {
        if (this.app && this.app.isRunning()) {
            return this.app.stop()
        }
    })

    it('shows an initial window', function() {
        return this.app.client.getWindowCount().then(function(count) {
            assert.equal(count, 1)
                // Please note that getWindowCount() will return 2 if `dev tools` are opened.
                // assert.equal(count, 2)
        })
    })


    it('enters value for the battle tag and logs in', function() {

        this.app.client.setValue('#BattleTag', 'test123');
        this.app.client.click('button=Login');

    });

    it('enters value, logs in, enters tournament', function() {

        this.app.client.setValue('#BattleTag', '1');
        this.app.client.click('button=Login');
        this.app.client.click('button=Enter Tournament');

    });

    it('enters value, logs in, enters tournament, enters tournament id & joins', function() {

        this.app.client.setValue('#BattleTag', '1');
        this.app.client.click('button=Login');
        this.app.client.click('button=Enter Tournament');
        this.app.client.setValue('#tournament', '1');
        this.app.client.click('button=Join Tournament');

    });

})