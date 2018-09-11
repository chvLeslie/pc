angular.module("router", ['ui.router'])
    // 路由状态配置
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        // 路由缺省配置 参数为url中的hash值
        $urlRouterProvider.otherwise('/applicant/1234');
        $stateProvider
            .state('applicant', {
                url: '/applicant/:batch',
                views: {
                    "": {
                        templateUrl: 'template/applicantInfo.html',
                        controller: 'applicantInfo'
                    }
                }
            })
            .state('scheme', {
                url: '/scheme/:batch',
                views: {
                    "": {
                        templateUrl: 'template/schemeConfirmation.html',
                        controller: 'schemeConfirmation'
                    }
                }
            })
            .state('scheme-change', {
                url: '/scheme-change/:batch',
                views: {
                    "": {
                        templateUrl: 'template/schemeChange.html',
                        controller: 'schemeChange'
                    }
                }
            })
            .state('insured', {
                url: '/insured/:batch',
                views: {
                    "": {
                        templateUrl: 'template/insuredInfo.html',
                        controller: 'insuredInfo'
                    }
                }
            })
            .state('import', {
                url: '/import/:batch',
                views: {
                    "": {
                        templateUrl: 'template/employeeImport.html',
                        controller: 'employeeImport'
                    }
                }
            })
            .state('confirm', {
                url: '/confirm/:batch',
                views: {
                    "": {
                        templateUrl: 'template/confirm.html',
                        controller: 'confirm'
                    }
                }
            })
    }])
    .directive('defLaydate', function ($timeout) {
        return {
            require: '?ngModel',
            restrict: 'A',
            scope: {
                ngModel: '=',
                maxDate: '@',
                minDate: '@'
            },
            link: function (scope, element, attr, ngModel) {
                var _date = null,
                    _config = {};
                // $timeout解决dom查询不到的问题
                $timeout(function () {
                    // 初始化参数 
                    _config = {
                        elem: '#' + attr.id,
                        format: attr.format != undefined && attr.format != '' ? attr.format : 'YYYY-MM-DD',
                        max: attr.hasOwnProperty('maxDate') ? attr.maxDate : '',
                        min: attr.hasOwnProperty('mindate') ? attr.mindate : '',
                        choose: function (data) {
                            scope.$apply(setViewValue);

                        },
                        clear: function () {
                            ngModel.$setViewValue(null);
                        }
                    };
                    // 初始化
                    _date = laydate(_config);

                    // 监听日期最大值
                    if (attr.hasOwnProperty('maxDate')) {
                        attr.$observe('maxDate', function (val) {
                            _config.max = val;
                        })
                    }
                    // 监听日期最小值
                    if (attr.hasOwnProperty('minDate')) {
                        attr.$observe('minDate', function (val) {
                            _config.min = val;
                        })
                    }

                    // 模型值同步到视图上
                    ngModel.$render = function () {
                        element.val(ngModel.$viewValue || '');
                    };

                    // 监听元素上的事件
                    element.on('blur keyup change', function () {
                        scope.$apply(setViewValue);
                    });

                    setViewValue();

                    // 更新模型上的视图值
                    function setViewValue() {
                        var val = element.val();
                        ngModel.$setViewValue(val);
                    }
                }, 0)
            }
        }
    })