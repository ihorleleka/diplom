import $ from 'jquery';
import AjaxService from 'app/mvc/services/AjaxService';
import login from './login.js';

var navigationContent = (function () {
  'use strict';

  var navigationContent = {
    data: null,
    $mainNavigation: $('.main-navigation'),
    $primaryLinks: $('.main-navigation .primary'),
    $pages: $('.pages'),

    init: function () {
      return navigationContent.initHeaderNavigation()
        .then(function () {
          navigationContent.createRelatedPages(navigationContent.data, 0);
        })
        .then(navigationContent.initHeaderTop);
    },

    initHeaderNavigation: function () {
      return AjaxService.get('php/getNavigationContent.php')
      .then(function (data) {
        navigationContent.data = JSON.parse(data);
      })
      .then(navigationContent.createNavigation);
    },

    initHeaderTop: function () {
      var info = login.readCookie();
      if (info != null) {
        var $loginLink = $('.utility-navigation .secondary a[dest="login"]');
        $loginLink.attr('dest', 'profile');
        $loginLink.html('<i class="icon icon icon-login"></i>Особистий кабінет');
      }
    },

    createNavigation: function () {
      navigationContent.data.forEach(function (category) {
        if (category.children.length > 0) {
          navigationContent.$primaryLinks
          .append(navigationContent.categoryWithChildren(category));
        } else {
          navigationContent.$primaryLinks
          .append(navigationContent.categoryWithoutChildren(category));
        }
      });
    },

    categoryWithoutChildren: function (category) {
      return `
            <li>
            <a href="${category.page_id}" reserved="${category.reserved}"
            class="category" item_id="${category.id}" dest="${category.page_id}" target="">
            ${category.name}
            </a>
            </li>`;
    },

    categoryWithChildren: function (category) {
      return `
            <li>
            <a href="${category.page_id}" class="js-has-sub-navigation
            has-sub-navigation category" reserved="${category.reserved}"
            item_id="${category.id}" target="">
            ${category.name}
            <span class="sub-level-arrow"></span>
            </a>
            <div class="relative-arrow">
            <div class="arrow-down"></div>
            </div>
            <div class="sub-navigation js-sub-navigation">
              <div class="sub-navigation-inner" item_id="${category.id}">
              ${navigationContent.subCategoriesTopics(category.children)}
              </div>
            </div>
            </li>`;
    },

    subCategoriesTopics: function (subCategoriesTopics) {
      var result = ``;
      subCategoriesTopics.forEach(function (subCategoryTopic) {
        result += `
        <ul item_id="${subCategoryTopic.id}" class="sub-category">
        <li>
          <a href="" reserved=${subCategoryTopic.reserved} target=""
          item_id="${subCategoryTopic.id}" class="js-enable-third-level third-level topic">
            ${subCategoryTopic.name}
            <span class="sub-level-arrow"></span>
          </a>
        </li>
        ${navigationContent.subCategories(subCategoryTopic.children, subCategoryTopic)}
        </ul>`;
      });

      return result;
    },

    subCategories: function (subCategories, parent) {
      var result = ``;
      subCategories.forEach(function (subCategory) {
        result += `
           <li>
            <a href="" reserved=${subCategory.reserved} target="" item_id="${subCategory.id}"
            dest="${subCategory.page_id}" class="subCategory">${subCategory.name}</a>
          </li>
          `;
      });

      return result;
    },

    createRelatedPages: function (data, level) {
      if (data == null) {
        return;
      }

      data.forEach(function (item) {
        if (item.page_id != null && item.page_id.length > 0) {
          navigationContent.$pages.append(`<div class="page editable container" level="${level}"
            item_id="${item.id}" name="${item.page_id}"></div>`);
        }

        navigationContent.createRelatedPages(item.children, level + 1);
      });
    }
  };
  return {
    init: navigationContent.init
  };
}());

if (typeof module !== 'undefined') {
  module.exports = navigationContent;
}
