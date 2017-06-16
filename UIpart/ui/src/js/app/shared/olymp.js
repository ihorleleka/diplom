import $ from 'jquery';
import PubSub from 'pubsub-js';
import validation from './validation.js';

var olymp = (function () {
  'use strict';

  var olymp = {
    roles: null,
    divisions: null,
    eventsList: null,
    userInfo: null,
    olympControlButtonTemplate: `<a dest="olympControl">
          <button>
              <span>Управління олімпіадами</span>
              <i class="icon icon-chevron-right"></i>
          </button>
        </a>`,
    olympControlPageTemaplte: `<div class="page hidden olympControlPage" name="olympControl">
    <h3>Управління олімпіадами</h3>
      <div class="row createNewEvent">
      </div>
      <div class="row evnetsList">
      </div>
    </div>`,
    createEventButtonTemplate: `<div class="col-xs-12">
          <div class="buttons-block">
          <button class="createEvent">
            <span>Створити олімпіаду</span>
            <i class="icon icon-pencil-solid"></i>
          </button>
          </div>
        </div>`,
    saveEventButtonTemplate: `<button class="saveEvent">
                <span>Зберегти</span>
                <i class="icon icon-check"></i>
            </button>`,
    newEventTemplate: `<div class="col-md-4 col-xs-12">
    <div class="input-group">
      <label>Назва</label>
      <input type="text" class="olympName" placeholder="Назва олімпіади" regex="^.{1,}$">
      <p>Поле Назва не може бути порожнім.</p>
    </div>
    </div>
    <div class="col-md-8 col-xs-12">
    <div class="input-group">
      <label>Описання</label>
      <textarea class="description" cols="32" rows="5"
      placeholder="Описання олімпіади" regex="^.{1,}$"/>
      <p>Поле Описання не може бути порожнім.</p>
    </div>
    </div>
    <div class="col-xs-12">
    <label>Регламент</label>
    <div id="newOlymp"></div>
    </div>`,
    eventButtonsBlock: `<div class="col-xs-12">
          <div class="buttons-block"></div></div>`,
    deleteEventTemplate: `<button class="deleteEvent">
                <span>Видалити олімпіаду</span>
                <i class="icon icon-close"></i>
            </button>`,
    publishEvent: `<button class="publishEvent">
                <span>Опублікувати олімпіаду</span>
                <i class="icon icon-globe"></i>
            </button>`,
    beginRegistration: `<button class="beginRegistration">
                <span>Почати реєстрацію</span>
                <i class="icon icon-info-row-online"></i>
            </button>`,
    endRegistration: `<button class="endRegistration">
              <span>Завершити реєстрацію</span>
              <i class="icon icon-info-row-online"></i>
          </button>`,
    archive: `<button class="archive">
                <span>Архівувати олімпіаду</span>
                <i class="icon icon-clock"></i>
            </button>`,
    results: `<button class="results">
                <span>Оголосити результати</span>
                <i class="icon icon-login"></i>
            </button>`,
    divisionsSelect: `<div class="col-md-4 col-xs-12">
    <label for="title">Розділ</label>
    <div class="custom-select-wrapper input-group">
      <i class="icon-chevron-down"></i>
      <select selected="false" class="chose-division">
      <option value="" disabled="" selected="">Виберіть розділ</option>
      <p>Вам необхідно вказати розділ</p>
    </div></div>`,
    pageSelect: `<div class="col-md-4 col-xs-12 page-select">
    <label for="title">Сторінка</label>
    <div class="custom-select-wrapper input-group">
      <i class="icon-chevron-down"></i>
      <select selected="false" class="chose-page">
      <option value="" disabled="" selected="">Виберіть сторінку</option>
      <p>Вам необхідно вказати розділ</p>
    </div></div>`,
    userRegistration: `<div class="col-xs-12">
    <div class="buttons-block">
    <button class="registration">
      <span>Прийняти участь</span>
      <i class="icon icon-login"></i>
    </button></div></div>`,
    firstPlace: `<div class="col-md-4 col-xs-12">
    <label for="title">I місце</label>
    <div class="custom-select-wrapper input-group">
      <i class="icon-chevron-down"></i>
      <select selected="false" class="first-place">
      <option value="" disabled="" selected="">Оберіть переможця</option>
    </div></div>`,
    secondPlace: `<div class="col-md-4 col-xs-12">
    <label for="title">II місце</label>
    <div class="custom-select-wrapper input-group">
      <i class="icon-chevron-down"></i>
      <select selected="false" class="second-place">
      <option value="" disabled="" selected="">II місце</option>
    </div></div>`,
    thirdPlace: `<div class="col-md-4 col-xs-12">
    <label for="title">III місце</label>
    <div class="custom-select-wrapper input-group">
      <i class="icon-chevron-down"></i>
      <select selected="false" class="third-place">
      <option value="" disabled="" selected="">III місце</option>
    </div></div>`,
    publishWinnersButton: `<div class="col-xs-12 publishWinners">
          <div class="buttons-block">
          <button class="publishWinnersButton">
            <span>Оголосити переможців</span>
            <i class="icon icon-login"></i>
          </button>
          </div>
        </div>`,

    init: function () {
      olymp.bindEvents();
      PubSub.publishSync('getAllEvents');
    },

    bindEvents: function () {
      PubSub.subscribe('userInfoReceived', olymp.userInfoReceived);
      PubSub.subscribe('getDivisionsSuccess', olymp.getDivisionsSuccess);
      PubSub.subscribe('createEventSuccess', olymp.createEventSuccess);
      PubSub.subscribe('eventsInfoReceived', olymp.eventsInfoReceived);
      PubSub.subscribe('publishEventSuccess', olymp.reload);
      PubSub.subscribe('archiveEventSuccess', olymp.reload);
      PubSub.subscribe('registrationStateChanged', olymp.registrationStateChanged);
      $('body').one('click', function () {
        if (olymp.userInfo != null) {
          olymp.initOlymp();
          PubSub.publishSync('olympPagesEdit');
        }
      });
    },

    reload: function () {
      location.reload();
    },

    userInfoReceived: function (msg, data) {
      olymp.userInfo = data;
      olymp.roles = data.roles;
    },

    getDivisionsSuccess: function (msg, data) {
      olymp.divisions = data;
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

    initOlymp: function () {
      if (olymp.isInRole(olymp.roles, '1')) {
        olymp.continueInit();
      } else if (olymp.isInRole(olymp.roles, '2')) {
        olymp.filterDivisions();
        olymp.continueInit();
      }

      olymp.manageRegistrationButtons();
      olymp.addListOfParticipants();
    },

    filterDivisions: function () {
      var neededRoles = olymp.roles.filter(function (role) {
        return role.division_id != null;
      });

      var rolesAcceptedDivision = neededRoles.map(function (role) {
        if (role.division_id != null) {
          return role.division_id;
        }
      });

      olymp.divisions = olymp.divisions.filter(function (division) {
        return rolesAcceptedDivision.indexOf(division.id) != -1;
      });
    },

    continueInit: function () {
      var $profilePage = $('.page.profile');
      var $buttonsBlock = $profilePage.find('.buttons-block').first();
      $buttonsBlock.append(olymp.olympControlButtonTemplate);
      $('.content .pages .container').first().append(olymp.olympControlPageTemaplte);
      olymp.enableCreateEvents();
      olymp.eventsList.forEach(olymp.handleEvent);
      olymp.enableEventListButtons();
    },

    current: function (obj) {
      var last = null;
      for (var a in obj) {
        last = a;
      }

      return obj[last];
    },

    enableCreateEvents: function () {
      var $createNewEventBlock = $('.page.olympControlPage .createNewEvent');
      $createNewEventBlock.append(olymp.createEventButtonTemplate);
      $createNewEventBlock.find('.createEvent').click(function () {
        $createNewEventBlock.find('.buttons-block').html(olymp.saveEventButtonTemplate);
        $createNewEventBlock.prepend(olymp.newEventTemplate);
        CKEDITOR.appendTo('newOlymp');
        $createNewEventBlock.find('.saveEvent').click(function () {
          var page = $(this).parents('.page');
          if (validation.validatePage(page) && !$(this).hasClass('clicked')) {
            $(this).addClass('clicked');
            $('body').addClass('blured');
            var data = olymp.collectData($createNewEventBlock);
            var instance = olymp.current(CKEDITOR.instances);
            data.reglament = '<label>Регламент</label>' + instance.getData();
            instance.destroy();
            $createNewEventBlock.html('');
            PubSub.publishSync('createEvent', data);
          }
        });
      });
    },

    collectData: function ($block) {
      var name = $block.find('.olympName').val();
      var description = $block.find('.description').val();
      return { name: name, description: description };
    },

    createEventSuccess: function (msg, data) {
      $('body').removeClass('blured');
      olymp.eventsList = data.msg.events;
      olymp.rebuildEventsPage();
      $('.content .pages .container').first()
      .append(`<div class="page olympPage editable hidden" item_id="${data.msg.eventId}"
        name="${data.msg.pageId}">
        <h3>${data.data.name}</h3>
        <p>${data.data.description}</p>
        ${data.data.reglament}</div>`);
    },

    eventsInfoReceived: function (msg, data) {
      olymp.eventsList = data;
    },

    handleEvent: function (event) {
      var $evnetsList = $('.page.olympControlPage .evnetsList');
      var extraClasses = '';
      if (event.published == '1') {
        extraClasses += ' published';
      }

      if (event.archived == '1') {
        extraClasses += ' archived';
      }

      if (event.registration == '1') {
        extraClasses += ' registration';
      }

      $evnetsList.prepend(`<div item_id="${event.id}" class="event ${extraClasses}">
        <div class="col-xs-12 event-info">
          <h4>${event.name}</h4>
          <span>${event.description}</span>
          <a dest="${event.page_id}">Перейти до сторінки олімпіади</a>
        </div>
        </div>`);
    },

    selectAddOption: function (optionText, optionId, $select) {
      $select.append(`<option value="${optionId}">${optionText}</option>`);
    },

    enableEventListButtons: function () {
      var $events = $('.page.olympControlPage .evnetsList .event');
      $events.each(function (index, event) {
        var $event = $(event);
        var eventId = $event.attr('item_id');
        var pageId = $event.find('a').attr('dest');
        $event.append(olymp.eventButtonsBlock);
        var $buttonsBlock = $(event).find('.buttons-block');
        if (!$event.hasClass('published')) {
          $buttonsBlock.append(olymp.publishEvent);
          olymp.bindPostEvent($event, $buttonsBlock, eventId);
        }

        if (!$event.hasClass('archived')) {
          if ($event.hasClass('registration')) {
            $buttonsBlock.append(olymp.endRegistration);
            olymp.bindEndRegistration($event, eventId);
          } else {
            $buttonsBlock.append(olymp.beginRegistration);
            olymp.bindBeginRegistration($event, eventId);
          }
        }

        $buttonsBlock.append(olymp.results);
        olymp.bindPostResultsButton($event, pageId, $buttonsBlock, eventId);
        if (!$event.hasClass('archived')) {
          $buttonsBlock.append(olymp.archive);
          olymp.bindArchiveEvent($event, $buttonsBlock, eventId);
        }

        $buttonsBlock.append(olymp.deleteEventTemplate);
        olymp.bindDeleteEvent($event, eventId, pageId);
      });
    },

    bindPostResultsButton: function ($event, pageId, $buttonsBlock, eventId) {
      $event.find('.results').click(function () {
        $buttonsBlock.parent().remove();
        $event.append(olymp.firstPlace);
        var $select = $event.find('.first-place');
        var event = olymp.eventsList.find(function (event) {
          return event.id == eventId;
        });

        event.participants.forEach(function (participant) {
          var value = participant.lastName + ' ' + participant.firstName
          + ' ' + participant.fatherName;
          olymp.selectAddOption(value, value, $select);
        });

        $select.change(function () {
          $event.find('.second-place').remove();
          $event.append(olymp.secondPlace);
          var $secondPlaceSelect = $event.find('.second-place');
          event.participants.forEach(function (participant) {
            var value = participant.lastName + ' ' + participant.firstName
            + ' ' + participant.fatherName;
            olymp.selectAddOption(value, value, $secondPlaceSelect);
          });

          $secondPlaceSelect.change(function () {
            $event.find('.third-place').remove();
            $event.append(olymp.thirdPlace);
            var $thirdPlaceSelect = $event.find('.third-place');
            event.participants.forEach(function (participant) {
              var value = participant.lastName + ' ' + participant.firstName
              + ' ' + participant.fatherName;
              olymp.selectAddOption(value, value, $thirdPlaceSelect);
            });

            $thirdPlaceSelect.change(function () {
              $event.find('.publishWinners').remove();
              $event.append(olymp.publishWinnersButton);
              $event.find('.publishWinnersButton').click(function () {
                var data = `<h4>Вітаємо переможців!!!</h4>
                <ul>
                <li>I місце - ${$select.val()}</li>
                <li>II місце - ${$secondPlaceSelect.val()}</li>
                <li>III місце - ${$thirdPlaceSelect.val()}</li>
                </ul>`;
                PubSub.publishSync('createPost', { pageId: pageId, data: data });
                $(`.page[dest="${pageId}"]`).find('.posts').prepend(data);
                olymp.rebuildEventsPage();
              });
            });
          });
        });
      });
    },

    bindDeleteEvent: function ($event, eventId, pageId) {
      $event.find('.deleteEvent').click(function () {
        PubSub.publishSync('deleteEvent', { id: eventId, pageId: pageId });
        $event.remove();
        $(`.post.editable.event[event_id="${eventId}"]`).remove();
      });
    },

    bindPostEvent: function ($event, $buttonsBlock, eventId) {
      $event.find('.publishEvent').click(function () {
        $buttonsBlock.parent().remove();
        $event.append(olymp.divisionsSelect);
        var $select = $event.find('.chose-division');
        olymp.divisions.forEach(function (item) {
          olymp.selectAddOption(item.name, item.id, $select);
        });

        $select.change(function () {
          var topicId = $select.val();
          var $targets = $(`.sub-navigation .sub-navigation-inner
            ul[item_id="${topicId}"]`).find('a.subCategory');
          $('.page-select').remove();
          $event.append(olymp.pageSelect);
          var $pageSelect = $event.find('.chose-page');
          $targets.each(function (index, item) {
            var $item = $(item);
            olymp.selectAddOption($item.text(), $item.attr('dest'), $pageSelect);
          });

          $pageSelect.change(function () {
            $event.find('.publishEventApprove').remove();
            $event.append(`<div class="col-md-4 col-xs-12 publishEventApprove">
              ${olymp.publishEvent}
              </div>`);
            $event.find('button.publishEvent').click(function () {
              PubSub.publishSync('publishEvent', { pageId: $pageSelect.val(), eventId: eventId });
            });
          });
        });
      });
    },

    bindBeginRegistration: function ($event, eventId) {
      $event.find('.beginRegistration').click(function () {
        PubSub.publishSync('beginRegistration', { eventId: eventId });
      });
    },

    bindEndRegistration: function ($event, eventId) {
      $event.find('.endRegistration').click(function () {
        PubSub.publishSync('endRegistration', { eventId: eventId });
      });
    },

    registrationStateChanged: function (msg, data) {
      olymp.eventsList = data;
      olymp.rebuildEventsPage();
    },

    rebuildEventsPage: function () {
      $('.row.createNewEvent').html('');
      $('.row.evnetsList').html('');
      olymp.enableCreateEvents();
      olymp.eventsList.forEach(olymp.handleEvent);
      olymp.enableEventListButtons();
    },

    bindArchiveEvent: function ($event, $buttonsBlock, eventId) {
      $event.find('.archive').click(function () {
        $buttonsBlock.parent().remove();
        $event.append(olymp.divisionsSelect);
        var $select = $event.find('.chose-division');
        olymp.divisions.forEach(function (item) {
          olymp.selectAddOption(item.name, item.id, $select);
        });

        $select.change(function () {
          var topicId = $select.val();
          var $targets = $(`.sub-navigation .sub-navigation-inner
            ul[item_id="${topicId}"]`).find('a.subCategory');
          $('.page-select').remove();
          $event.append(olymp.pageSelect);
          var $pageSelect = $event.find('.chose-page');
          $targets.each(function (index, item) {
            var $item = $(item);
            olymp.selectAddOption($item.text(), $item.attr('dest'), $pageSelect);
          });

          $pageSelect.change(function () {
            $event.find('.archiveEventApprove').remove();
            $event.append(`<div class="col-md-4 col-xs-12 archiveEventApprove">
              ${olymp.archive}
              </div>`);
            $event.find('button.archive').click(function () {
              PubSub.publishSync('archiveEvent', { pageId: $pageSelect.val(), eventId: eventId });
            });
          });
        });
      });
    },

    manageRegistrationButtons: function () {
      olymp.eventsList.forEach(function (event) {
        var $eventPost = $(`.post.editable.event[event_id="${event.id}"]`);
        var $event = $eventPost.find('.publishedEvent');
        if (olymp.checkIfAddRegButton($event, event)) {
          $event.append(olymp.userRegistration);
          $event.find('button.registration').click(function () {
            if (!olymp.userInfo.additionalInfo) {
              $('a[dest="userAddInfo"]').click();
            } else {
              if (!$(this).hasClass('clicked')) {
                $(this).addClass('clicked');
                $(this).parent().parent().remove();
                PubSub.publishSync('olympRegistration',
                { userId: olymp.userInfo.id, eventId: event.id });
              }
            }
          });
        }
      });
    },

    checkIfAddRegButton: function ($event, event) {
      var result = true;
      result = $event.length > 0;
      result = olymp.roles.length <= 0;
      result = event.registration == '1';
      if (olymp.userInfo.participants.length > 0) {
        result = olymp.checkListOfEventsForParticipating(event.id, olymp.userInfo.participants);
      }

      if (olymp.userInfo.pending.length > 0) {
        result = olymp.checkListOfEventsForParticipating(event.id, olymp.userInfo.pending);
      }

      return result;
    },

    checkListOfEventsForParticipating: function (eventId, listOfItems) {
      var result = true;
      listOfItems.forEach(function (item) {
        if (item.event_id == eventId) {
          result = false;
        }
      });

      return result;
    },

    addListOfParticipants: function () {
      olymp.eventsList.forEach(function (event) {
        var $eventPage = $(`.page.olympPage.editable[name="${event.page_id}"]`);
        $eventPage.append(olymp.buildListOfUsers(event.participants));
      });
    },

    buildListOfUsers: function (users) {
      var outputHtml = '<label>Учасники:</label><ul class="list-of-users">';
      users.forEach(function (user) {
        outputHtml += `<li>${user.lastName} ${user.firstName} ${user.fatherName}</li>`;
      });

      outputHtml += '</ul>';
      return outputHtml;
    }
  };
  return {
    init: olymp.init
  };
}());

if (typeof module !== 'undefined') {
  module.exports = olymp;
}
