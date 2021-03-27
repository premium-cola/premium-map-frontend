#!/bin/bash

# Strict mode
# from here: http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -e # Exit immediately if a simple command exits with a non-zero status
set -u # Treat unset variables and parameters other than the special parameters "@" and "*" as an error when performing parameter expansion.
set -o pipefail # If set, the return value of a pipeline is the value of the last  (right‐most) command to exit with a non-zero status, or zero if all commands in the pipeline exit successfully.
IFS=$'\n\t' # Internal Field Separator
# Some logoutput to know the last command that was executed when there is a error message
#set -x # Print the command before executing it

TMP_DIR="api.landkarte.premium-cola.de.log-analysis"
mkdir -p $TMP_DIR && cd "$_"

# Download access logs
#scp premium:/var/log/apache2/api.landkarte.premium-cola.de.access.log.*.gz ./

SUCCESSFUL_REQUEST="HTTP/1.1\" 200"
ITEM_LIST_REQUEST="GET /item/list"
SEARCH_REQUEST="GET /search/"
DEFAULT_COUNTRIES="countries[]=DE&countries[]=AT&countries[]=CH"
DEFAULT_TYPES="types[]=laeden&types[]=haendler&types[]=sprecher&types[]=webshop"
DEFAULT_PRODUCTS="products[]=cola&products[]=bier&products[]=frohlunder&products[]=muntermate"
APP_START_REQUEST="$ITEM_LIST_REQUEST?$DEFAULT_TYPES&$DEFAULT_COUNTRIES&$DEFAULT_PRODUCTS $SUCCESSFUL_REQUEST"

function amountOfRequestsByFilter() {
	find -name \*.gz -print0 | xargs -0 zgrep -F "$1" | wc -l
}

function amountOfItemListRequestsByFilter() {
	find -name \*.gz -print0 | xargs -0 zgrep -F "$ITEM_LIST_REQUEST" | grep -v -F "$1" | wc -l
}

echo "All successfull requests:"
amountOfRequestsByFilter "$SUCCESSFUL_REQUEST"
echo "App start requests:"
AMOUNT_OF_APP_START_REQUESTS=`amountOfRequestsByFilter "$APP_START_REQUEST"`
echo $AMOUNT_OF_APP_START_REQUESTS

echo "Search requests:"
amountOfRequestsByFilter "$SEARCH_REQUEST"

echo "Non-standard item list:"
amountOfItemListRequestsByFilter "$APP_START_REQUEST"
echo "Non-default countries item list:"
amountOfItemListRequestsByFilter "$DEFAULT_COUNTRIES"
echo "Non-default types item list:"
amountOfItemListRequestsByFilter "$DEFAULT_TYPES"
echo "Non-default products item list:"
amountOfItemListRequestsByFilter "$DEFAULT_PRODUCTS"

AMOUNT_OF_DAYS=`ls -1 ./ | wc -l`
APP_STARTS_PER_DAY=`expr $AMOUNT_OF_APP_START_REQUESTS / $AMOUNT_OF_DAYS`
echo "Users per Day:"
echo $APP_STARTS_PER_DAY

