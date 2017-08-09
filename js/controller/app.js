var app = angular.module("Praiastur", ['angularUtils.directives.dirPagination'])
        .value("urlBase", 'http://praiastur.kinghost.net/Praiastur/webservice/')
        .controller('LoginController', function ($http, urlBase) {
            var self = this;
            self.usuario = {};
            self.msgErro = null;

            self.activate = function () {
                self.usuario = JSON.parse(window.sessionStorage.getItem('usr'));
                if (self.usuario !== null) {
                    window.location.href = 'Contratos.xhtml';
                }
            };

            self.logar = function (login, senha) {
                $http({
                    method: 'GET',
                    url: urlBase + 'usuario/login/' + login + "/" + senha
                }).then(function succesCallBack(response) {
                    if (response.data !== null) {
                        self.usuario = response.data;
                        window.sessionStorage.setItem('usr', JSON.stringify(self.usuario));
                        window.location.href = 'Contratos.xhtml';
                    } else {
                        self.msgErro = ('Login ou senha estão incorretos.');
                    }
                }, function errorCallBack(erro) {
                    self.msgErro = ('Erro de conexão ao tentar fazer login, tente novamente.');
                });
            };

            self.activate();
        })
        .controller('AutenticacaoController', function () {
            var self = this;
            self.usuario = {};

            self.activate = function () {
                self.usuario = JSON.parse(window.sessionStorage.getItem('usr'));
                if (self.usuario === null) {
                    window.location.href = 'index.html';
                }
            };

            self.deslogar = function () {
                window.sessionStorage.removeItem('usr');
                window.location.href = 'index.html';
            };

            self.activate();
        })
        .controller('ChamadoController', function () {
            var self = this;

            self.activate = function () {

            };

            self.salvar = function () {

            };

            self.listar = function () {
                
            };
        });