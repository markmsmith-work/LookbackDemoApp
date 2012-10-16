This is an application that demo's the capabilities of the Lookback API, using the Lumenize library for time-series calculation.

The included Rakefile can be used to build the app for use with Rally's App SDK and the Lookback API.  You must have Ruby and the rake gem installed.

Available tasks are:

    rake build                      # Build a deployable app which includes all JavaScript and CSS resources inline.  The generated app.html is what you would paste into a custom html panel in Rally.
    rake clean                      # Clean all generated output
    rake debug                      # Build a debug version of the app, useful for local development
    rake jslint                     # Run jslint on all JavaScript files used by this app
    
You can find more information on installing Ruby and using rake tasks to simplify app development here: https://rally1.rallydev.com/apps/2.0p5/doc/#!/guide/appsdk_20_starter_kit

To launch chrome with cross-origin checks and file access checks disabled, on windows it will look something like:

    %LOCALAPPDATA%\Google\Chrome\Application\chrome.exe --disable-web-security --allow-file-access-from-files --allow-cross-origin-auth-prompt

On mac:

    cd /Applications
    open Google\ Chrome.app --args --disable-web-security --allow-file-access-from-files --allow-cross-origin-auth-prompt

