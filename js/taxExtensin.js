angular.module("myapp", ['router', 'employee'])
    .controller('main', ['$scope', '$rootScope', '$window', function ($scope, $rootScope, $window) {

    }])
    .controller('applicantInfo', ['$scope', '$timeout', '$state', '$stateParams', '$rootScope', 'employeeService', function ($scope, $timeout, $state, $stateParams, $rootScope, employeeService) {
        $scope.nextPage = function () {
            $state.go('scheme', {
                batch: '1234'
            })
        }
        $timeout(function () {
            // 将页面滚动到顶部
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        },100)
    }])
    .controller('schemeConfirmation', ['$scope', '$timeout', '$state', '$stateParams', '$rootScope', 'employeeService', function ($scope, $timeout, $state, $stateParams, $rootScope, employeeService) {
        $scope.nextPage = function () {
            $state.go('insured', {
                batch: '1234'
            })
        }
        $scope.prePage = function () {
            $state.go('applicant', {
                batch: '1234'
            })
        }
        $scope.changeScheme = function () {
            $state.go('scheme-change', {
                batch: '1234'
            })
        }
        $timeout(function () {
            // 将页面滚动到顶部
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        },100)
    }])
    .controller('schemeChange', ['$scope', '$timeout', '$state', '$stateParams', '$rootScope', 'employeeService', function ($scope, $timeout, $state, $stateParams, $rootScope, employeeService) {
        $scope.nextPage = function () {
            $state.go('scheme', {
                batch: '1234'
            })
        }
        $scope.prePage = function () {
            $state.go('scheme', {
                batch: '1234'
            })
        }
        $timeout(function () {
            // 将页面滚动到顶部
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        },100)
    }])
    .controller('insuredInfo', ['$scope', '$timeout', '$state', '$stateParams', '$rootScope', 'employeeService', function ($scope, $timeout, $state, $stateParams, $rootScope, employeeService) {
        $scope.nextPage = function () {
            $state.go('confirm', {
                batch: '1234'
            })
        }
        $scope.prePage = function () {
            $state.go('scheme', {
                batch: '1234'
            })
        }
        $scope.importEmployee = function () {
            $state.go('import', {
                batch: '1234'
            })
        }
        $timeout(function () {
            // 将页面滚动到顶部
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        },100)
    }])
    .controller('employeeImport', ['$scope', '$timeout', '$state', '$stateParams', '$rootScope', 'employeeService', function ($scope, $timeout, $state, $stateParams, $rootScope, employeeService) {
        $scope.nextPage = function () {
            $state.go('insured', {
                batch: '1234'
            })
        }
        $timeout(function () {
            // 将页面滚动到顶部
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        },100)
    }])
    .controller('confirm', ['$scope', '$timeout', '$state', '$stateParams', '$rootScope', 'employeeService', function ($scope, $timeout, $state, $stateParams, $rootScope, employeeService) {
        $scope.nextPage = function () {
            // $state.go('import', {
            //     batch: '1234'
            // })
        }
        $timeout(function () {
            // 将页面滚动到顶部
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        },100)
    }])