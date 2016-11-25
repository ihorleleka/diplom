
import PolicyHolderController from
  'app/components/PolicyHolder/PolicyHolderController';
import PolicyHolderView from
  'app/components/PolicyHolder/PolicyHolderView';

import ComponentElementGalleryController from
  './controllers/ComponentElementGalleryController';
import ComponentElementGalleryView from
  './views/ComponentElementGalleryView';

import TravelComponentGalleryController from
  './controllers/TravelComponentGalleryController';
import TravelComponentGalleryView from
  './views/TravelComponentGalleryView';

import QuizComponentGalleryController from
  './controllers/QuizComponentGalleryController';
import QuizComponentGalleryView from
  './views/QuizComponentGalleryView';

import ControllerRepository from 'app/mvc/shared/ControllerRepository';
import ViewBinder from 'app/mvc/views/ViewBinder';

export const elementDefinitions = [
  { viewType: PolicyHolderView,
    controllerType: PolicyHolderController },
  { viewType: ComponentElementGalleryView,
    controllerType: ComponentElementGalleryController },
  { viewType: TravelComponentGalleryView,
    controllerType: TravelComponentGalleryController },
  { viewType: QuizComponentGalleryView,
    controllerType: QuizComponentGalleryController }
];

export default function bindViews(container) {
  'use strict';

  let viewBinder = container.constitute(ViewBinder);
  viewBinder.bindViews(null, elementDefinitions);
}
