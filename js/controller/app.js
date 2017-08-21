var app = angular.module("RegistroChamado", ['angularUtils.directives.dirPagination'])
        .value("urlBase", 'http://localhost/RegistroChamado/webresources/ws.php/')
        .controller('LoginController', function ($http, urlBase) {
            var self = this;
            self.usuario = {};
            self.msgErro = null;

            self.activate = function () {
                self.usuario = JSON.parse(window.sessionStorage.getItem('usr'));
                if (self.usuario !== null) {
                    window.location.href = 'Chamados.html';
                }
            };

            self.logar = function () {                
                $http({
                    method: 'GET',
                    url: urlBase + 'usuario/login/' + self.usuario.login + '/' + self.usuario.senha            
                }).then(function succesCallBack(response) {                    
                    if (response.data !== null) {
                        self.usuario = response.data;
                        window.sessionStorage.setItem('usr', JSON.stringify(self.usuario[0]));                                            
                        window.location.href = 'Chamados.html';
                    } else {
                        self.msgErro = ('Login ou senha estão incorretos.');
                    }
                }, function errorCallBack(erro) {
                    self.msgErro = ('Erro de conexão ao tentar fazer login, tente novamente.');
                });
            };

            self.activate();
        })
        .controller('UsuarioController', function ($http, urlBase) {
            var self = this;
            self.usuario = {};

            self.activate = function () {
                if (window.sessionStorage.getItem('usr') === null) {
                    window.location.replace(window.history.back());
                } else {
                    self.usuario = JSON.parse(window.sessionStorage.getItem('usr'));
                    document.getElementById("idusuario").value = self.usuario.idusuario;
                    document.getElementById("login").value = self.usuario.login;
                    document.getElementById("senha").value = self.usuario.senha;
                }   
            };

            self.salvar = function () {
                $http({                    
                    url: urlBase + 'usuario/alterar',
                    data: self.usuario,
                    method: 'POST',
                    headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}               
                }).then(function succesCallBack (response) {                                        
                    window.sessionStorage.removeItem('usr');
                    window.sessionStorage.setItem('usr', JSON.stringify(self.usuario));
                    window.sessionStorage.setItem('msgAltUsr', 'Usuário alterado.');
                    window.location.href = 'Chamados.html';                    
                }, function errorCallBack (erro) {
                    self.msg('danger', 'Erro de conexão', 'Não foi possível alterar o chamado.');
                });
            };
            
            self.activate();
        })
        .controller('AutenticacaoController', function () {
            var self = this;
            self.usuario = {};

            self.active = function () {
                self.usuario = JSON.parse(window.sessionStorage.getItem('usr'));
                if (self.usuario === null) {
                    window.location.href = 'index.html';
                    /**
                     * MANDAR MSG PARA O LOGIN CASO O USUARIO NAO ESTEJA LOGADO
                     * "Faça login para continuar."                    
                     */
                }
            };

            self.deslogar = function () {
                window.sessionStorage.removeItem('usr');
                window.location.href = 'index.html';
            };

            self.active();
        })
        .controller('ChamadoController', function ($http, urlBase) {
            var self = this;
            self.chamado = {};           

            self.activate = function () {
                self.chamado.data = self.parseDateBr(new Date());
                self.chamado.hora = self.getHora();                
                document.getElementById("data").value = self.chamado.data;
                document.getElementById("hora").value = self.chamado.hora;
            };

            /*dd/MM/aaaa*/
            self.parseDateBr = function (date) {
                var dateFormated = '';

                if (date.getDate() < 10) {
                    dateFormated += '0' + date.getDate() + '/';
                } else {
                    dateFormated += date.getDate() + '/';
                }

                if ((date.getMonth() + 1) < 10) {
                    dateFormated += '0' + (date.getMonth() + 1) + '/';
                } else {
                    dateFormated += date.getMonth() + '/';
                }                    

                dateFormated += date.getFullYear();                            

                return dateFormated;
            };

            /*yyyy-MM-dd*/
            self.parseDateISO = function (date) {
                var dateFormated = '';
                dateFormated += date.getFullYear() + '-';
                if ((date.getMonth() + 1) < 10) {
                    dateFormated += '0' + (date.getMonth() + 1) + '-';
                } else {
                    dateFormated += date.getMonth();
                }

                if (date.getDate() < 10) {
                    dateFormated += '0' + date.getDate();
                } else {
                    dateFormated += date.getDate();
                }

                return dateFormated;
            };

            self.getHora = function () {
                var hour = new Date();
                var horaMin = '';                

                if (hour.getHours() < 10) {
                    horaMin = '0' + hour.getHours();
                } else {
                    horaMin = hour.getHours();
                     
                }

                if (hour.getMinutes() < 10) {
                    horaMin += ':0' + hour.getMinutes();
                } else {
                    horaMin += ':' + hour.getMinutes();                
                }

                return horaMin;
            };

            self.salvar = function () {
                $http({                    
                    url: urlBase + 'chamado/salvar',
                    data: self.chamado,
                    method: 'POST',
                    headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}               
                }).then(function succesCallBack (response) {                                                           
                    self.limparCampos();
                    self.msg('success', 'Operação concluída', 'O chamado foi registrado.');
                }, function errorCallBack (erro) {
                    self.msg('danger', 'Erro de conexão', 'Não foi possível registrar o chamado.');
                });
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
        .controller('ListChamadoController', function ($http, urlBase) {
            var self = this;            
            self.chamados = [];

            self.activate = function () {
                if (window.sessionStorage.getItem('msgAltChamado') !== null) {
                    self.msg('success', 'Operação concluída', window.sessionStorage.getItem('msgAltChamado'));
                    window.sessionStorage.removeItem('msgAltChamado');
                }

                if (window.sessionStorage.getItem('msgAltUsr') !== null) {
                    self.msg('success', 'Operação concluída', window.sessionStorage.getItem('msgAltUsr'));
                    window.sessionStorage.removeItem('msgAltUsr');
                }
                self.listar();
            };           

            self.listar = function () {
                $http({
                    method: 'GET',
                    url: urlBase + 'chamado/get'
                }).then(function succesCallBack (response) {
                    self.chamados = response.data;
                }, function errorCallBack (erro) {
                    self.msg('danger', 'Erro de conexão', 'Não foi listar os chamados.');
                });
            };

            self.alterar = function (chamado) {
                window.sessionStorage.setItem('altChamado', JSON.stringify(chamado));
                window.location.href = 'AlteraChamado.html';
            };

            self.deletar = function (chamado) {               
                $http({
                    method: 'GET',
                    url: urlBase + 'chamado/deletar/' + chamado.idchamado
                }).then(function succesCallBack (response) {                    
                    self.msg('success', 'Operação concluída', 'O chamado foi deletado.');                    
                    self.listar();
                }, function errorCallBack (erro) {
                    self.msg('danger', 'Erro de conexão', 'Não foi possivel deletar o chamado.\n' + erro);
                });
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
        .controller('AltChamadoController', function ($http, urlBase) {
            var self = this;
            self.chamado = {};
            self.cliente = {};
            self.clientes = [];

            self.activate = function () {
                if (window.sessionStorage.getItem('altChamado') === null) {
                    window.location.replace(window.history.back());
                } else {
                    self.chamado = JSON.parse(window.sessionStorage.getItem('altChamado'));

                    document.getElementById("idchamado").value = self.chamado.idchamado;
                    document.getElementById("nomepesat").value = self.chamado.nomepesat;
                    document.getElementById("data").value = self.chamado.data;
                    document.getElementById("hora").value = self.chamado.hora;
                    document.getElementById("sistema").value = self.chamado.sistema;
                    document.getElementById("problema").value = self.chamado.problema;
                    document.getElementById("solucao").value = self.chamado.solucao;

                    $http({
                        method: 'GET',
                        url: urlBase + 'cliente/get'
                    }).then(function succesCallBack (response) {
                        self.clientes = response.data;
                    });

                    for (var i = 0; i < self.clientes.length; i++) {
                        if (self.chamado.cliente.nome === self.chamado.cliente.nome){
                            document.getElementById("cbxCli").selectedIndex = (i + 1);
                            break;
                        }
                    }

                }
            };

            self.salvar = function () {
                $http({                    
                    url: urlBase + 'chamado/alterar',
                    data: self.chamado,
                    method: 'POST',
                    headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}               
                }).then(function succesCallBack (response) {                                        
                    window.sessionStorage.removeItem('altChamado');
                    window.sessionStorage.setItem('msgAltChamado',
                        'Chamado de id ' + self.chamado.idchamado + ' foi alterado com sucesso.');
                    window.location.href = 'Chamados.html';                    
                }, function errorCallBack (erro) {
                    self.msg('danger', 'Erro de conexão', 'Não foi possível alterar o chamado.');
                });
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

            self.salvar = function () {
                $http({                    
                    url: urlBase + 'cliente/salvar',
                    data: self.cliente,
                    method: 'POST',
                    headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}               
                }).then(function succesCallBack (response) {                                                           
                    document.getElementById("nome").value = "";
                    self.msg('success', 'Operação concluída', 'Cliente cadastrado.');
                }, function errorCallBack (erro) {
                    self.msg('danger', 'Erro de conexão', 'Não foi possível cadastrar o cliente.');
                });
            };

            self.listar = function () {
                $http({
                    method: 'GET',
                    url: urlBase + 'cliente/get'
                }).then(function succesCallBack (response) {
                    self.clientes = response.data;
                });
            };

            self.deletar = function (cliente) {               
                $http({
                    method: 'GET',
                    url: urlBase + 'cliente/deletar/' + cliente.idcliente
                }).then(function succesCallBack (response) {                    
                    self.msg('success', 'Operação concluída', 'O cliente foi deletado.');                    
                    self.listar();
                }, function errorCallBack (erro) {
                    self.msg('danger', 'Erro de conexão', 'Não foi possivel deletar o cliente.\n' + erro);
                });
            };

            self.msg = function (classe, titulo, texto) {
                $.gritter.add({
                    title: titulo,
                    text: texto,
                    class_name: classe
                });
            };       

            self.activate();
        });