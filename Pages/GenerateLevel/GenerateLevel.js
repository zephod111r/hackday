(function initGenerateLevel(Root) {

    "use strict";

    Page.Create('./Pages/GenerateLevel/GenerateLevel.html', {
        Ready: {
            value: function (element, options) {

                var button = new Buttons.Text("id_Back");
                button.Parent = element;
                button.OnClick = function () {
                    Page.Navigate('./Pages/MainMenu/MainMenu.html');
                };
                button.AddClass('BackButton');

                var menu = new DisplayElement.Wrap(document.createElement('div'));
                menu.Parent = element;
                menu.AddClass("GenerateLevelBackground");

                var menuTitle = new DisplayElement.Text("GenerateLevel_Title");
                menuTitle.Parent = menu.Element;
                menuTitle.AddClass("Title");

                this.resources = { Food: 0, Wood: 0, Stone: 0, Ore: 0, PreciousMetals: 0, Energy: 0 }

                var resources = new DisplayElement.Wrap(document.createElement('div'));
                resources.Element.innerText = "GenerateLevel_Resources".Translate(this.resources.Food, this.resources.Wood, this.resources.Stone, this.resources.Ore, this.resources.PreciousMetals, this.resources.Energy);
                resources.Parent = menu.Element;

                button = new Buttons.Text("GenerateLevel_AddResource");
                button.Parent = menu.Element;
                button.OnClick = function (event) {

                    this.resources.Food += 100000;
                    this.resources.Wood += 10000;
                    this.resources.Stone += 1000;
                    this.resources.Ore += 100;
                    this.resources.PreciousMetals += 10;
                    this.resources.Energy += 1;

                    resources.Element.innerText = "GenerateLevel_Resources".Translate(this.resources.Food, this.resources.Wood, this.resources.Stone, this.resources.Ore, this.resources.PreciousMetals, this.resources.Energy);
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }.bind(this);

                var range = new Controls.NumberInput("game_Wood", 0, 0, 10000, 50);
                range.Parent = menu;

                button = new Buttons.Text("GenerateLevel_Start");
                button.Parent = menu.Element;
                button.OnClick = function (event) {
                    Page.Navigate('./Pages/Game/Game.html', this.resources);
                    Application.EnableSpinner();
                }.bind(this);

            }, writable: false, enumerable: true
        },
        Unload: {
            value: function () {
            }, writable: false, enumerable: true
        }
    });

})();