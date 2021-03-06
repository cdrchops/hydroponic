var express = require('express');
var router = express.Router();
var user = require('./user.js');
var models = require('../models');
var device = require('./device.js');
var utils = require('./utils.js');

function sendSettingToDevice(data, callback) {
  var startdate = utils.getDateFromGMT(data.startdate);
  var topic = 'device/' + data.DeviceMac + '/esp';
  var closedate = utils.getDateFromGMT(data.closedate);
  var publishData = {
    mac: data.DeviceMac,
    type: "setting",
    reporttime: data.reporttime,
    startdate: startdate.date + '_' + startdate.month + '_' + startdate.year,
    closedate: closedate.date + '_' + closedate.month + '_' + closedate.year
  }

  device.client.publish(topic, JSON.stringify(publishData), callback);
}


router.get('/all', user.authenticate(), function (req, res) {
  var mac = req.query.mac;
  models.Device.getDeviceByMac(mac, function (device) {
    if (device) {
      device.getCrops({ order: [['createdAt', 'DESC']] }).then(function (result) {
        var cropList = [];

        result.forEach(function (item) {
          cropList.push(item.dataValues);
        })

        res.json({
          success: true,
          data: cropList,
          message: 'Get all crop success!'
        });
      })
    } else {
      res.json({
        success: false,
        message: 'Device does not exist!'
      })
    }
  })
})

router.get('/one', user.authenticate(), function (req, res) {

  models.Crop.getCropById(req.query.id, function (result) {
    if (result) {
      res.json({
        success: true,
        data: result.dataValues,
        message: 'Get crop success !'
      })
    } else {
      res.json({
        success: false,
        message: 'Crop does not exist !'
      })
    }
  })
})

router.get('/newest', user.authenticate(), function (req, res) {
  
    models.Crop.getNewestCropByDeviceMac(req.query.mac, function (result) {
      if (result) {
        res.json({
          success: true,
          data: result.dataValues,
          message: 'Get crop success !'
        })
      } else {
        res.json({
          success: false,
          message: 'Crop does not exist !'
        })
      }
    })
  })

router.post('/add', user.authenticate(), function (req, res) {
  // check crop name already exist
  models.Crop.getCropByName(req.body.name, req.body.DeviceMac, function (result) {
    if (result) {
      res.json({
        success: false,
        message: "Name has already existed"
      });
    } else {
      var newCrop = req.body;
      models.Crop.createCrop(newCrop, function () {
        // send to device
        sendSettingToDevice(req.body, function () {
          res.json({
            success: true,
            message: "Add crop success"
          })
        })
      });
    }
  });

})

router.delete('/delete', user.authenticate(), function (req, res) {
  models.Crop.deleteCrop(req.query.id, function (success) {
    if (success) {
      res.json({
        success: true,
        message: "Crop is deleted"
      });
    } else {
      res.json({
        success: false,
        message: "Crop can not be deleted"
      });
    }
  })
})

router.put('/edit', user.authenticate(), function (req, res) {
  models.Crop.getCropById(req.body.id, function (result) {
    result.update({
      name: req.body.name,
      treetype: req.body.treetype,
      startdate: req.body.startdate,
      closedate: req.body.closedate,
      reporttime: req.body.reporttime
    }).then(function () {
      // send to device
      sendSettingToDevice(req.body, function () {
        res.send({
          success: true,
          message: "Edit success"
        })
      });

    });
  });

})

router.put('/share', user.authenticate(), function (req, res) {
  models.Crop.getCropById(req.body.id, function (crop) {
    if (crop) {
      crop.updateShare(req.body.share, function () {
        res.json({
          success: true,
          message: 'Update share status success !'
        })
      })
    } else {
      res.json({
        success: false,
        message: 'Crop does not exist !'
      })
    }
  })
})

router.get('/search', function (req, res) {

  if (req.query.type === 'tree') {
    // search by tree
    models.Crop.getCropsByTree(req.query.data, function (result) {

      var data = [];
      result.forEach(function (element) {
        data.push(element.dataValues);
      })

      res.json({
        success: true,
        data: data,
        message: 'Search success !'
      })
    })
  } else if (req.query.type === 'month') {
    // search by month
    models.Crop.getCropByMonth(req.query.data, function (result) {
      res.json({
        success: true,
        data: result,
        message: 'Search success !'
      })
    })
  } else {
    res.json({
      success: false,
      message: 'Cannot search !'
    })
  }



})
module.exports.router = router;
