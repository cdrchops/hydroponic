controller.controller('DeviceCtrl', function ($http, $state, $stateParams, $window, $scope, DeviceService, CropService, GetTimeService, flash) {

  /*---------------------- device ----------------------*/

  // display all devices of user and display on profile.html
  DeviceService.getAllDevicesByUserId().then(function (result) {

    console.log(result.data.data);
    if (result.data.success) {
      $scope.listDevice = result.data.data;
      $scope.dataTableOpt = {
       //custom datatable options
      // or load data through ajax call also
      "aLengthMenu": [[10, 20, 30, 50, -1], [10, 20, 30, 50,'All']],
      };

    } else {
      flash.error = result.data.message;
    }
  });

  // add a new device
  $scope.newDevice = {
    status: "no connection"
  }

  $scope.addDevice = function () {
    //$('#addDeviceModal').modal('hide');

    DeviceService.addDevice($scope.newDevice).then(function (result) {
      if (result.data.success) {
        flash.success = result.data.message;
        bootbox.alert(result.data.message, function () {
          $state.go('profile');
        })

      } else {
        flash.error = result.data.message;
      }

    });

  }

  $scope.deleteDevice = function (index, mac) {
    var device = {
      mac: mac
    };

    bootbox.confirm('Do you want to delete this device ?', function (yes) {
      if (yes) {
        DeviceService.deleteDevice(device).then(function (result) {
          if (result.data.success) {
            $scope.listDevice.splice(index, 1);
            flash.success = result.data.message;
          } else {
            flash.error = result.data.message;
          }
        });
      }
    })
  }

});

controller.controller('DeviceDetailCtrl', function ($stateParams, $scope, DeviceService) {
  /* query all device data */
  DeviceService.getDeviceByMac($stateParams.mac).then(function (result) {
    $scope.device = result.data;
  });
})
