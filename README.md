# Auth0 Scripts

This repo will be used to store database action scripts with Auth0.

There are currently 6 scripts:
- `Login`
- `Create`
- `Verify`
- `Change Password`
- `Get User`
- `Delete`

Using these scripts on custom databases:
1) First you will need to copy these scripts into Auth0 --> Authentication --> Database --> Custom Database --> Database Action Scripts
2) Create an encrypted variable in the `Database Settings` for your database password 
3) Replace `configuration.new_password` in the `client` variable declaration to your password from `Database Settings`
4) Change the `db` and `collection name to 
5) These scripts were for testing purposes, you will need to specify what values you want each script to return.

More information on this can be found here: https://auth0.com/docs/authenticate/database-connections/custom-db/templates
