var app = angular.module("RegistroChamado", ['angularUtils.directives.dirPagination'])
        .value("urlBase", 'http://localhost/RegistroChamado/webresources/ws.php/')
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
        .controller('ChamadoController', function ($http, urlBase) {
            var self = this;
            self.chamado = {};
            self.chamados = [];

            self.activate = function () {
                self.listar();
            };

            self.salvar = function () {
                $http({                    
                    url: urlBase + 'salvar',
                    data: self.chamado,
                    method: 'POST',
                    headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}               
                }).then(function succesCallBack (response) {                                        
                    self.listar();
                    self.limparCampos();
                    self.msg('success', 'Operação concluída', 'O chamado foi registrado.');
                }, function errorCallBack (erro) {
                    self.msg('danger', 'Erro de conexão', 'Não foi possível registrar o chamado.');
                });
            };

            self.listar = function () {
                $http({
                    method: 'GET',
                    url: urlBase + 'getChamados'
                }).then(function succesCallBack (response) {
                    self.chamados = response.data;
                }, function errorCallBack (erro) {
                    self.msg('danger', 'Erro de conexão', 'Não foi listar os chamados.');
                });
            };

            self.alterar = function () {
                
            };

            self.deletar = function () {

            };

            self.limparCampos = function () {
                document.getElementById("nomepesat").value = "";
                document.getElementById("data").value = "";
                document.getElementById("hora").value = "";
                document.getElementById("sistema").value = "";
                document.getElementById("problema").value = "";
                document.getElementById("solucao").value = "";
                document.getElementById("cbxCli").selectedIndex = 0;            
            };

            self.msg = function (classe, titulo, texto) {
                $.gritter.add({
                    title: titulo,
                    text: texto,
                    class_name: classe
                });
            };

            self.activate();
        })
        .controller('ClienteController', function ($http, urlBase) {
            var self = this;
            self.cliente = {};
            self.clientes = [];

            self.activate = function () {
                self.listar();
            };

            self.listar = function () {
                $http({
                    method: 'GET',
                    url: urlBase + 'getClientes'
                }).then(function succesCallBack (response) {
                    self.clientes = response.data;
                });
            };           

            self.activate();
        });