import $ from 'jquery';
import PubSub from 'pubsub-js';
import AjaxService from 'app/mvc/services/AjaxService';

var requestSender = (function () {
  'use strict';

  var requestSender = {
    init: function () {
      requestSender.bindEvents();
    },

    bindEvents: function () {
      PubSub.subscribe('RegistrationAttempt', requestSender.registrationHandler);
      PubSub.subscribe('SendFeedback', requestSender.sendFeedback);
      PubSub.subscribe('loginAttempt', requestSender.login);
      PubSub.subscribe('getUserInfo', requestSender.getUserInfo);
      PubSub.subscribe('getDivisions', requestSender.getDivisions);
      PubSub.subscribe('becomeTrainer', requestSender.becomeTrainer);
      PubSub.subscribe('getTrainersList', requestSender.getTrainersList);
      PubSub.subscribe('updateUserData', requestSender.updateUserData);
      PubSub.subscribe('createNewCategory', requestSender.createCategory);
      PubSub.subscribe('deleteCategory', requestSender.deleteCategory);
      PubSub.subscribe('createNewTopic', requestSender.createTopic);
      PubSub.subscribe('deleteTopic', requestSender.deleteTopic);
      PubSub.subscribe('createNewSubCategory', requestSender.createSubCategory);
      PubSub.subscribe('deleteSubCategory', requestSender.deleteSubCategory);
      PubSub.subscribe('createPost', requestSender.createPost);
      PubSub.subscribe('deletePost', requestSender.deletePost);
      PubSub.subscribe('updatePost', requestSender.updatePost);
      PubSub.subscribe('deleteFiles', requestSender.deleteFiles);
      PubSub.subscribe('createEvent', requestSender.createEvent);
      PubSub.subscribe('getAllEvents', requestSender.getAllEvents);
      PubSub.subscribe('deleteEvent', requestSender.deleteEvent);
      PubSub.subscribe('publishEvent', requestSender.publishEvent);
      PubSub.subscribe('beginRegistration', requestSender.beginRegistration);
      PubSub.subscribe('endRegistration', requestSender.endRegistration);
      PubSub.subscribe('archiveEvent', requestSender.archiveEvent);
      PubSub.subscribe('olympRegistration', requestSender.olympRegistration);
      PubSub.subscribe('forgotPassword', requestSender.forgotPassword);
    },

    registrationHandler: function (msg, data) {
      AjaxService.post('php/registration.php', data)
      .done(function (msg) {
        PubSub.publishSync('registrationComplete', msg);
      })
      .fail(function (xhr, status, error) {
        PubSub.publishSync('registrationFail', { xhr: xhr, status: status, error: error });
      });
    },

    sendFeedback: function (msg, data) {
      AjaxService.post('php/feedback.php', data)
      .done(function (msg) {
        PubSub.publishSync('feedbackSent', msg);
      })
      .fail(function (xhr, status, error) {
        PubSub.publishSync('feedbackSendFail', { xhr: xhr, status: status, error: error });
      });
    },

    login: function (msg, data) {
      AjaxService.post('php/login.php', data)
      .done(function (msg) {
        PubSub.publishSync('loginSuccess', msg);
      })
      .fail(function (xhr, status, error) {
        PubSub.publishSync('loginFail', { xhr: xhr, status: status, error: error });
      });
    },

    getUserInfo: function (msg, data) {
      AjaxService.post('php/getUserInfo.php', data)
      .done(function (msg) {
        PubSub.publishSync('userInfoReceived', msg);
      });
    },

    getDivisions: function (msg, data) {
      AjaxService.post('php/getDivisions.php', data)
      .done(function (msg) {
        PubSub.publishSync('getDivisionsSuccess', msg);
      })
      .fail(function (xhr, status, error) {
        PubSub.publishSync('getDivisionsFail', { xhr: xhr, status: status, error: error });
      });
    },

    becomeTrainer: function (msg, data) {
      AjaxService.post('php/becomeTrainer.php', data)
      .done(function (msg) {
        PubSub.publishSync('becomeTrainerSuccess', msg);
      })
      .fail(function (xhr, status, error) {
        PubSub.publishSync('becomeTrainerFail', { xhr: xhr, status: status, error: error });
      });
    },

    getTrainersList: function (msg, data) {
      AjaxService.post('php/getTrainers.php', data)
      .done(function (msg) {
        PubSub.publishSync('trainersListReceived', msg);
      });
    },

    updateUserData: function (msg, data) {
      AjaxService.post('php/updateUserData.php', data)
      .done(function (msg) {
        PubSub.publishSync('updateUserDataSuccess', msg);
      })
      .fail(function (xhr, status, error) {
        PubSub.publishSync('updateUserDataFail', { xhr: xhr, status: status, error: error });
      });
    },

    deleteCategory: function (msg, data) {
      AjaxService.post('php/deleteCategory.php', data)
      .done(function (msg) {
        PubSub.publishSync('deleteCategorySuccess', msg);
      });
    },

    createCategory: function (msg, data) {
      AjaxService.post('php/createCategory.php', data)
      .done(function (msg) {
        PubSub.publishSync('createCategorySuccess', msg);
      });
    },

    deleteTopic: function (msg, data) {
      AjaxService.post('php/deleteTopic.php', data)
      .done(function (msg) {
        PubSub.publishSync('deleteTopicSuccess', msg);
      });
    },

    createTopic: function (msg, data) {
      AjaxService.post('php/createTopic.php', data)
      .done(function (msg) {
        PubSub.publishSync('createTopicSuccess', msg);
      });
    },

    deleteSubCategory: function (msg, data) {
      AjaxService.post('php/deleteSubCategory.php', data)
      .done(function (msg) {
        PubSub.publishSync('deleteSubCategorySuccess', msg);
      });
    },

    createSubCategory: function (msg, data) {
      AjaxService.post('php/createSubCategory.php', data)
      .done(function (msg) {
        PubSub.publishSync('createSubCategorySuccess', msg);
      });
    },

    createPost: function (msg, data) {
      AjaxService.post('php/createPost.php', data)
      .done(function (msg) {
        data.postId = msg;
        PubSub.publishSync('createPostSuccess', data);
      });
    },

    deletePost: function (msg, data) {
      AjaxService.post('php/deletePost.php', data)
      .done(function (msg) {
        PubSub.publishSync('deletePostSuccess', msg);
      });
    },

    updatePost: function (msg, data) {
      AjaxService.post('php/updatePost.php', data)
      .done(function (msg) {
        PubSub.publishSync('updatePostSuccess', msg);
      });
    },

    deleteFiles: function (msg, data) {
      AjaxService.post('php/deleteFiles.php', data);
    },

    createEvent: function (msg, data) {
      AjaxService.post('php/createEvent.php', data)
      .done(function (msg) {
        PubSub.publishSync('createEventSuccess', { msg: msg, data: data });
      });
    },

    getAllEvents: function (msg, data) {
      AjaxService.post('php/getAllEvents.php', data)
      .done(function (msg) {
        PubSub.publishSync('eventsInfoReceived', msg);
      });
    },

    deleteEvent: function (msg, data) {
      AjaxService.post('php/deleteEvent.php', data)
      .done(function (msg) {
        PubSub.publishSync('deleteEventSuccess', msg);
      });
    },

    publishEvent: function (msg, data) {
      AjaxService.post('php/publishEvent.php', data)
      .done(function (msg) {
        PubSub.publishSync('publishEventSuccess', msg);
      });
    },

    beginRegistration: function (msg, data) {
      AjaxService.post('php/beginRegistration.php', data)
      .done(function (msg) {
        PubSub.publishSync('registrationStateChanged', msg);
      });
    },

    endRegistration: function (msg, data) {
      AjaxService.post('php/endRegistration.php', data)
      .done(function (msg) {
        PubSub.publishSync('registrationStateChanged', msg);
      });
    },

    archiveEvent: function (msg, data) {
      AjaxService.post('php/archiveEvent.php', data)
      .done(function (msg) {
        PubSub.publishSync('archiveEventSuccess', msg);
      });
    },

    olympRegistration: function (msg, data) {
      AjaxService.post('php/olympRegistration.php', data)
      .done(function (msg) {
        PubSub.publishSync('olympRegistrationSuccess', msg);
      });
    },

    forgotPassword: function (msg, data) {
      AjaxService.post('php/forgotPassword.php', data)
      .done(function (msg) {
        PubSub.publishSync('passwordResetLinkSent', msg);
      })
      .fail(function (xhr, status, error) {
        PubSub.publishSync('passwordResetLinkSentFail', { xhr: xhr, status: status, error: error });
      });
    }
  };

  return {
    init: requestSender.init
  };
}());

if (typeof module !== 'undefined') {
  module.exports = requestSender;
}
