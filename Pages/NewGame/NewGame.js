(function initNewGame(Root) {

    "use strict";

    Page.Create('./Pages/NewGame/NewGame.html', {
        Ready: {
            value: function (element, options) {


                var menu = new DisplayElement.Wrap(document.createElement('div'));
                menu.Parent = element;
                menu.AddClass("NewGameBackground");


                var menuTitle = new DisplayElement.Text("NewGame_Title");
                menuTitle.Parent = menu.Element;
                menuTitle.AddClass("Title");

                var button = new Buttons.Text("id_Back");
                button.Parent = element;
                button.OnClick = function () {
                    Page.Navigate('./Pages/MainMenu/MainMenu.html');
                };
                button.AddClass('BackButton');
                button.Align(DisplayElement.AlignType.topleft);

                var buttons = [];
                var promise = new StateMachine.Promise(function (c, e, p) {

                    var genderSubTitle = new DisplayElement.Text("game_Select_Character_Gender");
                    genderSubTitle.AddClass("Sub_Title");
                    genderSubTitle.Parent = menu.Element;
                    this.push(genderSubTitle);

                    var male = new Buttons.Text("game_Male");
                    male.OnClick = function () {
                        c("male");
                    };
                    male.Parent = menu.Element;
                    this.push(male);

                    var female = new Buttons.Text("game_Female");
                    female.OnClick = function () {
                        c("female");
                    }
                    female.Parent = menu.Element;
                    this.push(female);

                }.bind(buttons)).Then(function(gender) {
                    Application.Game.Gender = gender;

                    for (var index = 0; index < this.length; ++index) {
                        var button = this[index];
                        button && button.Dispose && button.Dispose();
                    }

                    buttons.splice(0, buttons.length);

                    return new StateMachine.Promise(function (c, e, p) {

                        var nameSubTitle = new DisplayElement.Text("NewGame_CharacterName");
                        nameSubTitle.AddClass("Sub_Title");
                        nameSubTitle.Parent = menu.Element;
                        this.push(nameSubTitle);

                        var input = new DisplayElement.Input();
                        input.Element.value = '';
                        input.Element.placeholder = "NewGame_CharacterName_Placeholder".Translate();
                        input.Parent = menu.Element;
                        input.Align(DisplayElement.AlignType.topcenter);

                        var response = function () {
                            var name = this.value;

                            if (name.length > 4 && ProfanityFilter.Check(name) == name) {
                                c(name);
                            } else {
                                // ... Todo,  
                            }
                        }.bind(input.Element);
                        input.Element.onafterupdate = response;
                        this.push(input);

                        var submit = new Buttons.Text("game_Submit");
                        submit.OnClick = response;

                        submit.Parent = menu.Element;
                        this.push(submit);

                    }.bind(buttons)).Then(function (name) {
                        Application.Game.UserName = name;

                        for (var index = 0; index < this.length; ++index) {
                            var button = this[index];
                            button && button.Dispose && button.Dispose();
                        }

                        buttons.splice(0, buttons.length);

                        Page.Navigate('./Pages/GenerateLevel/GenerateLevel.html');

                    }.bind(buttons));

                }.bind(buttons));
            }, writable: false, enumerable: true
        },
        Unload: {
            value: function () {
            }, writable: false, enumerable: true
        }
    });

})();