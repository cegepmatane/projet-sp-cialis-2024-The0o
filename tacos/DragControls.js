THREE.DragControls = function (_objects, _camera, _domElement) {

    var _plane = new THREE.Plane();
    var _raycaster = new THREE.Raycaster();

    var _mouse = new THREE.Vector2();
    var _offset = new THREE.Vector3();
    var _intersection = new THREE.Vector3();

    var _selected = null, _hovered = null;

    //

    var scope = this;

    function activate() {
        _domElement.addEventListener('pointermove', onPointerMove, false);
        _domElement.addEventListener('pointerdown', onPointerDown, false);
        _domElement.addEventListener('pointerup', onPointerCancel, false);
    }

    function deactivate() {
        _domElement.removeEventListener('pointermove', onPointerMove, false);
        _domElement.removeEventListener('pointerdown', onPointerDown, false);
        _domElement.removeEventListener('pointerup', onPointerCancel, false);
    }

    function dispose() {
        deactivate();
    }

    function onPointerMove(event) {
        event.preventDefault();
        _mouse.x = (event.clientX / _domElement.clientWidth) * 2 - 1;
        _mouse.y = - (event.clientY / _domElement.clientHeight) * 2 + 1;
        _raycaster.setFromCamera(_mouse, _camera);
        if (_selected && scope.enabled) {
            if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
                _selected.position.copy(_intersection.sub(_offset));
            }
            scope.dispatchEvent({ type: 'drag', object: _selected });
            return;
        }
        _raycaster.setFromCamera(_mouse, _camera);
        var intersects = _raycaster.intersectObjects(_objects);
        if (intersects.length > 0) {
            var object = intersects[0].object;
            _plane.setFromNormalAndCoplanarPoint(_camera.getWorldDirection(_plane.normal), object.position);
            if (_hovered !== object) {
                scope.dispatchEvent({ type: 'hoveron', object: object });
                _domElement.style.cursor = 'pointer';
                _hovered = object;
            }
        } else {
            if (_hovered !== null) {
                scope.dispatchEvent({ type: 'hoveroff', object: _hovered });
                _domElement.style.cursor = 'auto';
                _hovered = null;
            }
        }
    }

    function onPointerDown(event) {
        event.preventDefault();
        _mouse.x = (event.clientX / _domElement.clientWidth) * 2 - 1;
        _mouse.y = - (event.clientY / _domElement.clientHeight) * 2 + 1;
        _raycaster.setFromCamera(_mouse, _camera);
        var intersects = _raycaster.intersectObjects(_objects);
        if (intersects.length > 0) {
            _selected = intersects[0].object;
            if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
                _offset.copy(_intersection).sub(_selected.position);
            }
            _domElement.style.cursor = 'move';
            scope.dispatchEvent({ type: 'dragstart', object: _selected });
        }
    }

    function onPointerCancel(event) {
        event.preventDefault();
        if (_selected) {
            scope.dispatchEvent({ type: 'dragend', object: _selected });
            _selected = null;
        }
        _domElement.style.cursor = _hovered ? 'pointer' : 'auto';
    }

    activate();

    // API

    this.enabled = true;
    this.activate = activate;
    this.deactivate = deactivate;
    this.dispose = dispose;

    // Backward compatibility

    this.setObjects = function () {
        console.error('THREE.DragControls: setObjects() has been removed.');
    };

    this.on = function (type, listener) {
        console.warn('THREE.DragControls: on() has been deprecated. Use addEventListener() instead.');
        scope.addEventListener(type, listener);
    };

    this.off = function (type, listener) {
        console.warn('THREE.DragControls: off() has been deprecated. Use removeEventListener() instead.');
        scope.removeEventListener(type, listener);
    };

    this.notify = function () {
        console.error('THREE.DragControls: notify() has been deprecated. Use dispatchEvent() instead.');
        scope.dispatchEvent({ type: arguments[0], message: arguments[1] });
    };

};

THREE.DragControls.prototype = Object.create(THREE.EventDispatcher.prototype);
THREE.DragControls.prototype.constructor = THREE.DragControls;
