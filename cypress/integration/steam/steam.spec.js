// https://wiki.a1qa.com/pages/viewpage.action?pageId=681093258
import { sortPrices } from '../../utils/logic.js';

describe('Steam TS', () => {
    const DEFAULT_TIMEOUT = 10000;
    const HOST = 'https://store.steampowered.com';
    const SEARCH_RESULT = HOST + '/search/results?**';
    const STEAM_SHOP = '#global_header > div > div.supernav_container > a[data-tooltip-content=".submenu_store"]';
    const STEAM_SEARCH = '#store_nav_search_term';
    const STEAM_SHOP_SUGGESTIONS = '#search_suggestion_contents';
    const STEAM_SHOP_SEARCH_BUTTON = '#store_search_link > img';
    const STEAM_SHOP_RESULT_ROW = '#search_resultsRows';
    const STEAM_SHOP_RESULT_ROW_FILTER = '#sort_by_trigger';
    const STEAM_SHOP_FILTER_BY_DESC = '#Price_DESC';
    const STEAM_SHOP_ITEM_PRICE = 'div.col.search_price.responsive_secondrow';

    const parametrization = [
        {"game": "The Witcher", "items": 10},
        {"game": "Fallout", "items": 20}
    ]
    parametrization.forEach((param) => {
        it('Steam TC', () => {
            cy.visit(HOST);
            cy.findVisibleElement(STEAM_SHOP, DEFAULT_TIMEOUT);

            cy.get(STEAM_SEARCH).type(param.game);
            cy.findVisibleElement(STEAM_SHOP_SUGGESTIONS, DEFAULT_TIMEOUT);
            cy.get(STEAM_SHOP_SEARCH_BUTTON).click();
            cy.get(STEAM_SHOP_RESULT_ROW).find('a').should('not.be.empty');

            cy.intercept({method: "GET", url: SEARCH_RESULT,}).as("getSearch");
            cy.findVisibleElement(STEAM_SHOP_RESULT_ROW_FILTER, DEFAULT_TIMEOUT).click();
            cy.findVisibleElement(STEAM_SHOP_FILTER_BY_DESC, DEFAULT_TIMEOUT).click();
            cy.wait("@getSearch");

            cy.findVisibleElement(STEAM_SHOP_RESULT_ROW, DEFAULT_TIMEOUT).find('a')
                .find(STEAM_SHOP_ITEM_PRICE).then((prices) => {
                    const slicedArray = prices.slice(0, param.items);
                    sortPrices(slicedArray);
                });
            });
        });
    });
