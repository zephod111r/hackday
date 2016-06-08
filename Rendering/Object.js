(function initRenderObject(local) {
 
var renderObject = Class.Design(function(object, makeVisible){
    Object.defineProperties(this,
    {
        visible: {
            value: false,
            enumerable: true,
            writable:true,
            configurable:false
        },
        object: {
            value: object,
            enumerable:true,
            writable:true,
            configurable:false
        },
        sceneId: {
            value:-1,
            enumerable: false,
            writable:false,
            configurable:true
        },
        position: {
            value: null,
            writable: false,
            enumerable: false,
            configurable: true
        },
        rotation: {
            value: null,
            writable: false,
            enumerable: false,
            configurable: true
        },
        dirty: {
            value: true,
            writable: true,
            enumerable: false,
            configurable: false
        },
        children: {
            value: [],
            writable: false,
            enumerable: true,
            configurable: true
        }
    });
    
    this.Visible = !!makeVisible;
}, {
    RenderObject: {
        get: function() {
            return this.object;
        },
        enumerable: true,
        configurable: false
    },
    Visible:
    {
        get: function(){
            return this.visible;
        },
        set: function(value){
            if(this.visible == value){
                return;
            }
            this.visible = value;
            
            if(this.visible){
                var id = local.Scene.add(this);
                Object.defineProperty(this, "sceneId", { value: id });
            } else {
                local.Scene.remove(this.sceneId);
            }
        },
        enumerable: true,
        configurable: false
    },
    Update:
    {
        value: function(){
            if(!this.IsDirty)
            {
                // nothing to do.
                return;
            }
            if(this.position) {
                this.object.position.x = this.position.x;
                this.object.position.y = this.position.y;
                this.object.position.z = this.position.z;
            }
            if(this.rotation) {
                this.object.rotation.x = this.rotation.x;
                this.object.rotation.y = this.rotation.y;
                this.object.rotation.z = this.rotation.z;
            }
            this.object.updateMatrixWorld();
        },
        writable: false,
        enumerable: false,
        configurable: true
    },
    Position:
    {
        get: function() {
            if(!this.position){
                this.Position = new THREE.Vector3( 0, 0, 0);
            }
        
            return this.position;
        },
        set: function(position){
            Object.defineProperty(this, "position", {value: position });
            this.dirty = true;
        },
        enumerable: true,
        configurable: false
    },
    Rotation:
    {
        get: function() {
            if(!this.rotation){
                this.Rotation = new THREE.Vector3( 0, 0, 0);
            }
            
            return this.rotation;
        },
        set: function(rotation){
            Object.defineProperty(this, "rotation", { value: rotation });
            this.dirty = true;
        },
        enumerable: true,
        configurable: false
    },
    IsDirty: {
        get: function()
        {
            return this.dirty;
        },
        enumerable: false,
        configurable: false
    }
}, {
    
});
 
local.Renderable = renderObject;
  
})(Rendering);