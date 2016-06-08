(function initRenderObject(local) {
  
var Scene = Class.Design(function(scene){
    Object.defineProperties(this, {
        objects: {
            value: {},
            writable: false,
            configurable: true,
            enumerable: true
        },
        scene: {
            value: scene,
            writable: false,
            enumerable: true,
            configurable: true
        },
        nextSceneId: {
            value: 0,
            writable: false,
            configurable: true,
            enumerable:false
        }
    });
}, {
        Scene: {
            get: function() {
                return this.scene;
            },
            configurable: false,
            enumerable: true
        },
        add: {
            value: function(item){
                var sceneId = this.NewSceneId();
                this.objects[sceneId] = item;
                this.scene.add(item.RenderObject);
            },
            writable: false,
            enumerable: false,
            configurable: false
        },
        remove: {
            value: function(sceneId){
                if(!!this.objects[sceneId])
                {
                    this.scene.remove(this.objects[sceneId].RenderObject);
                    delete this.objects[sceneId];
                }
            },
            writable: false,
            enumerable: false,
            configurable: false
        },
        NewSceneId: {
            value: function(){
                var id = this.nextSceneId;
                var newId = id + 1;
                Object.defineProperty(this, "nextSceneId", { value: newId });
                return id.toString();
            },
            writable:false,
            enumerable:false,
            configurable: false
        },
        Update: {
            value: function() {
                for( var i = 0; i < this.nextSceneId; ++i)
                {
                    if(!!this.objects[i.toString()]) {
                        this.objects[i.toString()].Update();
                    }
                }
            },
            writable: false,
            enumerable: true,
            configurable: true
        }
    }, {
        
    });
  
  local.Scene = new Scene(new THREE.Scene());
  
  })(this.Rendering);