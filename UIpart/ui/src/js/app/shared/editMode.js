import $ from 'jquery';
import PubSub from 'pubsub-js';
import editor from 'ckeditor';

var editMode = (function () {
  'use strict';

  var editMode = {
    init: function () {
      editMode.bindEvents();
    },

    bindEvents: function () {
      PubSub.subscribe('userInfoReceived', editMode.userInfoReceived);
      PubSub.subscribe('createCategorySuccess', editMode.reload);
      PubSub.subscribe('deleteCategorySuccess', editMode.reload);
      PubSub.subscribe('createTopicSuccess', editMode.reload);
      PubSub.subscribe('deleteTopicSuccess', editMode.reload);
      PubSub.subscribe('createSubCategorySuccess', editMode.reload);
      PubSub.subscribe('deleteSubCategorySuccess', editMode.reload);
      PubSub.subscribe('createPostSuccess', editMode.createPostSuccess);
      PubSub.subscribe('updatePostSuccess', editMode.updatePostSuccess);
    },

    updatePostSuccess: function (msg, data) {
      editMode.disableEdit(false);
    },

    reload: function () {
      location.reload();
    },

    userInfoReceived: function (msg, data) {
      if (editMode.isInRole(data.roles, 1)) {
        editMode.initHeaderTop();
        if (sessionStorage.getItem('mode') === 'edit') {
          editMode.enableEdit();
        }
      }
    },

    isInRole: function (roles, roleId) {
      var result = false;
      roles.forEach(function (obj) {
        if (obj.role_id == roleId) {
          result = true;
        }
      });

      return result;
    },

    initHeaderTop: function () {
      var template = `<li>
        <a class="changeMode"><i class="icon icon-pencil-solid"></i>Режим редагування</a>
      </li>`;
      $('ul.secondary').append(template);
      $('body').on('click', 'ul.secondary li a.changeMode', editMode.changeMode);
      if (sessionStorage.getItem('mode') === 'edit') {
        $('ul.secondary li a.changeMode').text('Вийти з режиму редагування');
      }
    },

    changeMode: function () {
      if (sessionStorage.getItem('mode') === 'edit') {
        sessionStorage.setItem('mode', 'preview');
      } else {
        sessionStorage.setItem('mode', 'edit');
      }

      location.reload();
    },

    enableEdit: function () {
      editMode.addDivisionButtonsInit();
      editMode.categoriesEdit();
      editMode.categoriesTopicsEdit();
      editMode.subcategoriesEdit();
      editMode.addDeleteButtons();
      editMode.addPostsFunctionality();
    },

    addDeleteButtons: function () {
      $('a').each(function (index, value) {
        var $item = $(value);
        if ($item.attr('reserved') == 0) {
          var itemClass = '';
          if ($item.hasClass('category')) {
            itemClass = 'category';
          } else if ($item.hasClass('topic')) {
            itemClass = 'topic';
          } else if ($item.hasClass('subCategory')) {
            itemClass = 'subCategory';
          }

          $item.parent().append(`<a item_id="${$item.attr('item_id')}" class="delete ${itemClass}">
            <i class="icon-close"></i></a>`);
        }
      });

      $('body').on('click', 'a.delete', function () {
        PubSub.publishSync('lockNavOpen');
        $(this).html('Видалити розділ <i class="icon-check">');
        $(this).removeClass('delete');
        $(this).addClass('delete-approve');
      });

      $('body').on('click', 'a.delete-approve', function () {
        var $tag = $(this);
        $('body').addClass('blured');
        if ($tag.hasClass('category')) {
          PubSub.publishSync('deleteCategory', { id: $tag.attr('item_id') });
        } else if ($tag.hasClass('topic')) {
          PubSub.publishSync('deleteTopic', { id: $tag.attr('item_id') });
        } else if ($tag.hasClass('subCategory')) {
          PubSub.publishSync('deleteSubCategory', { id: $tag.attr('item_id') });
        }
      });
    },

    addDivisionButtonsInit: function () {
      $('.primary').append(`<li class="edit">
        <a><i style="vertical-align: middle;" class="icon-hospital-ver-2"/></li>`);
      $('.sub-navigation-inner .sub-category')
      .append(`<li class="edit third-level">
        <a><i style="vertical-align: middle;" class="icon-hospital-ver-2"></i></li>`);
      $('.sub-navigation-inner')
      .append(`<ul class="sub-category" style="max-height: initial;"><li class="edit topic">
        <a><i style="vertical-align: middle;" class="icon-hospital-ver-2"></i></li></ul>`);
      editMode.addTopicToEmptyCategory($('a.category'));
    },

    categoriesEdit: function () {
      $('body').on('click', 'ul li.edit a', function (event) {
        if ($(this).parents('.sub-navigation').length == 0) {
          $(this).addClass('categoryAdd');
          editMode.handleParentNodeAfterAddNewClick($(this).parent());
        }
      });
    },

    categoriesTopicsEdit: function () {
      $('body').on('click', 'ul li.edit a', function (event) {
        if ($(this).parent().hasClass('third-level')) {
          PubSub.publishSync('lockNavOpen');
          $(this).addClass('subCategoryAdd');
          var subNavigation = $(this).parents('.sub-navigation')[0];
          var atag = $($(subNavigation).parent()).find('.js-has-sub-navigation');

          editMode.handleParentNodeAfterAddNewClick($(this).parent());
        }
      });
    },

    subcategoriesEdit: function () {
      $('body').on('click', 'ul li.edit a', function (event) {
        if ($(this).parent().hasClass('topic')) {
          PubSub.publishSync('lockNavOpen');
          $(this).addClass('topicAdd');
          var subNavigation = $(this).parents('.sub-navigation')[0];
          var atag = $($(subNavigation).parent()).find('.js-has-sub-navigation');

          editMode.handleParentNodeAfterAddNewClick($(this).parent(), $(atag));
        }
      });
    },

    handleParentNodeAfterAddNewClick: function (parent, category) {
      parent.removeClass('edit');
      parent.addClass('edit-submit');
      parent.prepend(`<input type="text" placeholder="Назва нового розділу"/>`);
      var $atag = parent.find('a');
      $atag.off();
      $atag.click(function (event) {
        var $parent = $(this).parent();
        var value = $parent.find('input').val();
        if (value.length > 0) {
          $('body').addClass('blured');
          editMode.collectIdAndSendRequest(value, $(this));
        }
      });
    },

    collectIdAndSendRequest: function (value, tag) {
      if (tag.hasClass('topicAdd')) {
        var categoryId = tag.parents('.sub-navigation-inner').attr('item_id');
        PubSub.publishSync('createNewTopic', { name: value, categoryId: categoryId });
      } else if (tag.hasClass('subCategoryAdd')) {
        var subCategoryTopicId = tag.parents('.sub-category').attr('item_id');
        PubSub.publishSync('createNewSubCategory', { name: value, topicId: subCategoryTopicId });
      } else if (tag.hasClass('categoryAdd')) {
        PubSub.publishSync('createNewCategory', { name: value });
      }
    },

    addTopicToEmptyCategory: function (tags) {
      tags.each(function (index, value) {
        var $element = $(value);
        if (!$element.hasClass('js-has-sub-navigation')) {
          $element.parent().append(`<div class="relative-arrow">
            <div class="arrow-down"></div>
            </div>
            <div class="sub-navigation js-sub-navigation">
              <div class="sub-navigation-inner" item_id="${$element.attr('item_id')}">
                <ul class="sub-category" style="max-height: initial;">
                  <li class="edit topic">
                    <a><i style="vertical-align: middle;" class="icon-hospital-ver-2"></i></a>
                  </li>
                </ul>
              </div>
            </div>`);
          var $subNav = $element.parent().find('.js-sub-navigation');
          $element.hover(function () {
            $subNav.show();
          });

          $subNav.hover(function () {
            $subNav.show();
          },

          function () {
            $subNav.hide();
          });
        }
      });
    },

    addPostsFunctionality: function () {
      $('.page.editable').prepend(`<div class="row addNewPost">
        <div class="col-md-4 col-md-offset-4 col-xs-12 col-xs-offset-0">
        <a class="addPost"><i class="icon-hospital-ver-2"></i></a>
        </div>
        </div>`);
      editMode.bindAddPostsEvents();
      $('.page.editable .post.editable').each(function (index, post) {
        var $post = $(post);
        if (!($post.find('.postIteractoins').length > 0)) {
          $post.append(`<div class="row postIteractoins">
            <div class="col-md-2 col-md-offset-8 col-xs-6 col-xs-offset-0">
            <a class="editCurrentPost"><i class="icon-pencil-solid"></i></a>
            </div>
            <div class="col-md-2 col-xs-6">
            <a class="deleteCurrentPost"><i class="icon-close"></i></a>
            </div>
            </div>`);
        }

      });

      editMode.bindDeletePostsEvents();
      editMode.bindEditPostsEvents();
    },

    bindAddPostsEvents: function () {
      $('a.addPost').click(function () {
        var $tag = $(this);
        var $currentPage = $tag.parent().parent().parent();
        var level = $currentPage.attr('level');
        var pageId = $currentPage.attr('name');
        if (!($currentPage.find(`#${level + pageId}`).length > 0)) {
          $currentPage.prepend(`<div id="${level + pageId}"/>`);
        }

        var editor = CKEDITOR.appendTo(level + pageId);
        $tag.html('Зберегти');
        $tag.off();
        $tag.click(function () {
          var $tag = $(this);
          var $currentPage = $tag.parent().parent().parent();
          var level = $currentPage.attr('level');
          var pageId = $currentPage.attr('name');
          var computed = level + pageId;
          var instance = editMode.current(CKEDITOR.instances);
          var data = instance.getData();
          if (data != '') {
            PubSub.publishSync('createPost', { pageId: pageId, data: data });
          }

          instance.destroy();
          $(`#${computed}`).remove();
          $('.addNewPost').remove();
        });
      });
    },

    current: function (obj) {
      var last = null;
      for (var a in obj) {
        last = a;
      }

      return obj[last];
    },

    createPostSuccess: function (msg, data) {
      var pageId = data.pageId;
      var htmlToInsert = data.data;
      var findExpression = '[name="' + pageId + '"]';
      var $page = $('.pages').find(findExpression);
      $page.prepend(`<div item_id="${data.postId}" class="post editable">${htmlToInsert}</div>`);
      editMode.addPostsFunctionality();
      editMode.bindDeletePostsEvents();
      editMode.bindEditPostsEvents();
    },

    bindDeletePostsEvents: function () {
      $('a.deleteCurrentPost').click(function () {
        var $element = $(this);
        var $post = $element.parent().parent().parent();
        PubSub.publishSync('deletePost', { postId: $post.attr('item_id') });
        $post.remove();
      });
    },

    bindEditPostsEvents: function () {
      $('a.editCurrentPost').click(function () {
        var $element = $(this);
        if ($element.attr('disabled')) {
          return;
        }

        editMode.disableEdit(true);
        var $post = $element.parent().parent().parent();
        var $page = $post.parent();
        var level = $page.attr('level');
        var pageId = $page.attr('name');
        var postId = $post.attr('item_id');
        $post.find('.postIteractoins').remove();
        var data = $post.html();
        $post.html('');
        $post.prepend(`<div id="${level + pageId + postId}"/>`);
        CKEDITOR.appendTo(level + pageId + postId);
        $post.append(`<div class="row addNewPost">
        <div class="col-md-4 col-md-offset-4 col-xs-12 col-xs-offset-0">
        <a class="addPost">Зберегти</a>
        </div>
        </div>`);
        var instance = editMode.current(CKEDITOR.instances);
        instance.setData(data);
        $post.find('a.addPost').click(function () {
          var $post = $(this).parent().parent().parent();
          var postId = $post.attr('item_id');
          var instance = editMode.current(CKEDITOR.instances);
          var data = instance.getData();
          if (data != '') {
            PubSub.publishSync('updatePost', { postId: postId, data: data });
          }

          instance.destroy();
          $post.html(data);
          $post.append(`<div class="row postIteractoins">
            <div class="col-md-2 col-md-offset-8 col-xs-6 col-xs-offset-0">
            <a class="editCurrentPost"><i class="icon-pencil-solid"></i></a>
            </div>
            <div class="col-md-2 col-xs-6">
            <a class="deleteCurrentPost"><i class="icon-close"></i></a>
            </div>
            </div>`);
          editMode.bindDeletePostsEvents();
          editMode.bindEditPostsEvents();
        });
      });
    },

    disableEdit: function (value) {
      $('a.editCurrentPost').attr('disabled', value);
    }
  };
  return {
    init: editMode.init
  };
}());

if (typeof module !== 'undefined') {
  module.exports = editMode;
}
