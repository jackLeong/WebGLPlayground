var CW = function (e) {
    var n, t;

    function a(e) {
        n.update(), t.update(e), requestAnimationFrame(a)
    }

    (n = new CW.Stage).development = !1, n.init(document.getElementById("container_3d"), document.getElementById("solid"), document.getElementById("gradient")), (t = new CW.SceneManager(n)).load(function () {
        t.start(e)
    }), a(0)
};
CW.Curtain = function () {
    THREE.Object3D.call(this), this.changing = !1, this.faceCount = 6, this.sortedFaces = [], this.mesh, this.transitionCallback, this._init()
}, CW.Curtain.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Curtain, update: function () {
        if (this.changing) {
            for (var t = 0; t < this.faceCount; t++) {
                if (0 === this.sortedFaces.length) return this.changing = !1, this.mesh.geometry.elementsNeedUpdate = !0, void (this.transitionCallback && this.transitionCallback());
                var e = this.sortedFaces[this.sortedFaces.length - 1].index;
                this.sortedFaces.splice(this.sortedFaces.length - 1, 1), this.mesh.geometry.faces[e].materialIndex = 3
            }
            this.mesh.geometry.elementsNeedUpdate = !0
        }
    }, transition: function (t) {
        this.changing = !0, this.transitionCallback = t
    }, _init: function () {
        var i, n = this._getPlaneGeometry(), s = [], a = new THREE.Vector3(-1600, 0, 0);
        CW.Util.forEach(n.faces, function (t, e) {
            i = CW.Util.distanceVector3(a, n.vertices[t.a]), s.push({index: e, _distance: i})
        }), this.sortedFaces = this._getNearSort(s);
        var t = CW.SceneTitle.sceneColor;
        this.mesh = new THREE.Mesh(n, [new THREE.MeshBasicMaterial({
            color: t,
            wireframe: !1,
            side: THREE.FrontSide
        })]), this.add(this.mesh)
    }, _getPlaneGeometry: function () {
        var t = new THREE.PlaneGeometry(700, 200, 60, 30);
        return CW.Util.forEach(t.vertices, function (t, e) {
            t.x += CW.Util.random(-5, 5), t.y += CW.Util.random(-5, 5), t.z += CW.Util.random(-20, 20)
        }), t
    }, _getNearSort: function (t) {
        return t.sort(function (t, e) {
            var i = 0;
            return t._distance > e._distance ? i = -1 : t._distance < e._distance && (i = 1), i
        })
    }
});
CW.EventDispatcher = function () {
}, CW.EventDispatcher.prototype = {
    addEventListener: function (i, e) {
        void 0 === this._listeners && (this._listeners = {});
        var t = this._listeners;
        void 0 === t[i] && (t[i] = []), -1 === t[i].indexOf(e) && t[i].push(e)
    }, hasEventListener: function (i, e) {
        if (void 0 === this._listeners) return !1;
        var t = this._listeners;
        return void 0 !== t[i] && -1 !== t[i].indexOf(e)
    }, removeEventListener: function (i, e) {
        if (void 0 !== this._listeners) {
            var t = this._listeners[i];
            if (void 0 !== t) {
                var s = t.indexOf(e);
                -1 !== s && t.splice(s, 1)
            }
        }
    }, dispatchEvent: function (i) {
        if (void 0 !== this._listeners) {
            var e = this._listeners[i.type];
            if (void 0 !== e) {
                i.target = this;
                for (var t = e.slice(0), s = 0, n = t.length; s < n; s++) t[s].call(this, i)
            }
        }
    }
};
CW.Indicator = function () {
    this.position, this.vertex = new THREE.Vector3, this.offset, this.dom, this.circle, this.text, this.dropPosition, this.dropVertex = new THREE.Vector3, this.svg, this.line, this.arrow, this._createDom()
}, CW.Indicator.prototype = {
    update: function (t, e, i) {
        this.vertex.copy(this.position), this.offset && this.vertex.add(this.offset);
        var s = this.vertex.project(i), o = s.x * t + t, h = -s.y * e + e;
        if (TweenLite.set(this.dom, {x: o, y: h}), this.dropPosition) {
            this.dropVertex.copy(this.dropPosition);
            var r = this.dropVertex.project(i), c = r.x * t + t, n = -r.y * e + e, a = Math.floor(c - o),
                l = Math.floor(n - h), d = new THREE.Vector2(a, l);
            d.setLength(5);
            var p = Math.abs(a), u = Math.abs(l), m = a < 0 ? a : 0, v = l < 0 ? l : 0;
            this.svg.setAttribute("width", p), this.svg.setAttribute("height", u), this.svg.setAttribute("viewBox", m + " " + v + " " + p + " " + u), TweenLite.set(this.svg, {
                top: v,
                left: m
            }), this.line.setAttribute("d", "M" + d.x + "," + d.y + " L" + a + "," + l);
            var g = Math.atan2(l, a), f = g - 3 * Math.PI / 4, b = g + 3 * Math.PI / 4, w = a + 10 * Math.cos(f),
                x = l + 10 * Math.sin(f), E = a + 10 * Math.cos(b), M = l + 10 * Math.sin(b);
            this.arrow.setAttribute("points", a + "," + l + "," + w + "," + x + "," + E + "," + M), this._checkDistance(p + u)
        }
    }, getDom: function () {
        return this.dom
    }, setPosition: function (t, e) {
        this.position = t.clone(), this.offset = e
    }, setObject: function (t, e) {
        this.position = t.position, this.offset = e
    }, setDragPosition: function (t) {
        this.dropPosition = t.clone();
        var e = "http://www.w3.org/2000/svg";
        this.svg = document.createElementNS(e, "svg"), this.svg.setAttribute("width", 500), this.svg.setAttribute("height", 500), this.svg.setAttribute("overflow", "visible"), this.line = document.createElementNS(e, "path"), this.line.setAttribute("stroke", "rgba(255,255,255,.7)"), this.line.setAttribute("stroke-width", 2), this.line.setAttribute("d", "M0 0 L0 0"), this.svg.appendChild(this.line), this.arrow = document.createElementNS(e, "polygon"), this.arrow.setAttribute("fill", "rgba(255,255,255,.7)"), this.arrow.setAttribute("points", "0, 0, 0, 0, 0, 0"), this.svg.appendChild(this.arrow), this.dom.appendChild(this.svg)
    }, setColor: function () {
        this.dom.classList.add("black")
    }, setText: function (t) {
        this.text = document.createElement("span"), this.text.className = "text", this.text.innerHTML = t, this.dom.appendChild(this.text)
    }, _createDom: function () {
        this.dom = document.createElement("div"), this.dom.className = "indicator", this.group = document.createElement("div"), this.group.className = "group", this.dom.appendChild(this.group), this.circle = document.createElement("div"), this.circle.className = "circle circle-0", this.group.appendChild(this.circle), this.circle1 = document.createElement("div"), this.circle1.className = "circle circle-1", this.group.appendChild(this.circle1), this.circle2 = document.createElement("div"), this.circle2.className = "circle circle-2", this.group.appendChild(this.circle2), this.center = document.createElement("div"), this.center.className = "center", this.group.appendChild(this.center)
    }, _checkDistance: function (t) {
        this.svg.style.display = t < 40 ? "none" : "block"
    }
};
CW.IndicatorManager = function (e) {
    var i = this, n = document.getElementById("indicators"), s = [];
    this.widthHalf = 0, this.heightHalf = 0, this.add = function (t, e, i, o) {
        var a = new CW.Indicator;
        t.isVector3 ? a.setPosition(t, e) : a.setObject(t, e), o && a.setText(o), i && a.setColor(i), s.push(a), n.appendChild(a.getDom())
    }, this.addDrag = function (t, e, i, o) {
        var a = new CW.Indicator;
        t.isVector3 ? a.setPosition(t, e) : a.setObject(t, e), a.setDragPosition(i), o && a.setText(o), s.push(a), n.appendChild(a.getDom())
    }, this.remove = function (t) {
        t = t || .5;
        var e = s[0];
        e && (s.splice(0, 1), TweenLite.to(e.group, t, {
            scaleX: .1,
            scaleY: .1,
            opacity: 0,
            ease: Power2.easeInOut,
            onComplete: function () {
                n.removeChild(e.getDom()), e = null
            }
        }))
    }, this.update = function () {
        this.widthHalf = e.size.width / 2, this.heightHalf = e.size.height / 2, CW.Util.forEach(s, function (t) {
            t.update(i.widthHalf, i.heightHalf, e.camera)
        })
    }
};
CW.TextManager = function (n) {
    var a = [void 0, "고철덩어리가 된 몸을 움직였다.\n집에 가고 싶다는 생각이 들었다.", "몸을 일으켜 세웠다.\n바퀴를 굴릴 때마다 온몸이 삐그덕 거렸다.", "여기가 어딘지, 집이 어디에 있는지 알 수 없어서\n무작정 앞을 향해 걷기 시작했다.", "세상은 무서운 게 너무나도 많았고, 정체모를 것들이 다가왔다.\n그들이 누군지 도무지 알 수 없었다.", "그들은 손을 내밀었고, 그 손을 잡고 바다에 빠졌다.\n구름 속을 헤매었다.\n알 수 없는 곳을 지났다.", "저기에 집이 있지 않을까.\n하늘 위로 올라갔다.", "별이 쏟아져내리고 밤하늘은 아름다웠다.\n그러나 여기에 집은 없었다.", "그곳에는 있지 않을까.", "그러나 그곳에도 집은 없었고 결국 발길을 돌렸다.", "점점 무서운 것들이 많아지고, 이곳이 어디인지 알 수 없었다.", "걸음이 느려지고, 잘못된 길을 가고 있는건 아닌가 라는 생각이 들 때 즈음에", "마침내 끝에 도착했다.", void 0],
        c = document.getElementById("book"), d = document.createElement("div");
    this.start = function (n) {
        this.next(n)
    }, this.next = function (n) {
        var e = a[n];
        if (c.innerHTML = "", void 0 !== e) {
            var t = "", i = e.split("\n"), o = d.cloneNode();
            10 < n && (o.style.color = "#404040"), CW.Util.forEach(i, function (n, e) {
                t += "<p>" + n + "</p>"
            }), o.innerHTML = t, c.appendChild(o), CW.Util.forEach(o.children, function (n, e) {
                TweenLite.set(n, {delay: 2 * e, opacity: 0, y: 20}), TweenLite.to(n, 3, {
                    delay: 2 * e,
                    y: 0,
                    opacity: .4,
                    ease: Sine.easeOut
                })
            })
        }
    }
};
CW.Stage = function (t) {
    CW.EventDispatcher.call(this);
    var s, h, a = this, i = new THREE.Raycaster, e = document.getElementById("container_3d"), n = {type: "mousemove"},
        o = {type: "mousedown"}, r = {type: "mouseup"}, d = {type: "mouseout"}, c = {type: "touchstart"},
        l = {type: "touchend"}, g = {type: "touchmove"}, p = {type: "click"}, m = new CW.IndicatorManager(this);
    this.isControlCamera = !0;
    var u = new THREE.Vector3, L = new THREE.Vector3, w = 200;
    this.development = t, this.dom = null, this.domBgSolid = null, this.domBgGradient = null, this.domHeader = null, this.ambiLight, this.hemiLight, this.dirLight, this.spotLight, this.pointLight, this.hemiLightHelper, this.dirLightHelper, this.spotLightHelper, this.pointLightHelper, this.axisHelper, this.control, this.camera, this.cameraHelper, this.scene, this.renderer, this.skybox, this.stats, this.gui, this.grid, this.size = {
        width: 0,
        height: 0
    }, this.mouse = new THREE.Vector2, this.mouse2d = new THREE.Vector2;
    var f = new function () {
        this.ambientColor = "#6e6e6e", this.intensity = .3, this.visible = !0
    }, y = new function () {
        this.x = -1e3, this.y = 2e3, this.z = 2e3, this.intensity = .5, this.color = "#efefef", this.visible = !0, this.castShadow = !0, this.shadowMapWidth = 1024, this.shadowMapHeight = 1024, this.shadowBias = 0, this.shadowCameraLeft = -3e3, this.shadowCameraRight = 3e3, this.shadowCameraTop = 5e3, this.shadowCameraBottom = -5e3
    }, v = new function () {
        this.visible = !0, this.skyColor = "#ffffff", this.groundColor = "#f2f0e4", this.color = "#2e3439", this.intensity = .5, this.x = 0, this.y = 30, this.z = -20
    }, E = new function () {
        this.visible = !1, this.color = "#cacac4", this.castShadow = !1, this.intensity = .7, this.distance = 1e4, this.angle = Math.PI / 4, this.exponent = 10, this.decay = 1.5, this.x = -140, this.y = 301, this.z = 213, this.shadowMapWidth = 1024, this.shadowMapHeight = 1024, this.shadowCameraNear = 1, this.shadowCameraFar = 1e4, this.shadowCameraFov = 30
    }, C = new function () {
        this.visible = !1, this.castShadow = !1, this.color = "#ffffff", this.intensity = 1, this.distance = 100, this.decay = 1, this.x = -10, this.y = 30, this.z = 0
    };

    function H(t) {
        t.preventDefault(), M(t.clientX, t.clientY), a.dispatchEvent(o)
    }

    function b(t) {
        t.preventDefault(), 1 === t.touches.length && (M(t.touches[0].pageX, t.touches[0].pageY), a.dispatchEvent(c))
    }

    function T(t) {
        t.preventDefault(), M(t.clientX, t.clientY), I(), a.dispatchEvent(n)
    }

    function S(t) {
        var e, i;
        t.preventDefault(), t.stopPropagation(), 1 === t.touches.length && (M(t.touches[0].pageX, t.touches[0].pageY), e = a.mouse2d.x, i = a.mouse2d.y, L.x = CW.Util.map(e, 0, a.size.width, u.x - w, u.x + w), L.y = CW.Util.map(i, 0, a.size.height, u.y - w, u.y + w), L.z = CW.Util.map(e, 0, a.size.height, u.z - w, u.z + w), a.dispatchEvent(g))
    }

    function x(t) {
        M(t.clientX, t.clientY), a.dispatchEvent(r)
    }

    function z() {
        a.dispatchEvent(d)
    }

    function R(t) {
        t.preventDefault(), 0 === t.touches.length && a.dispatchEvent(l)
    }

    function W(t) {
        t.preventDefault(), M(t.clientX, t.clientY), a.dispatchEvent(p)
    }

    function B() {
        var t = CW.Util.distanceVector3(a.camera.position, a.control.target), e = Math.min(1e4, Math.max(t, 3e3));
        w = Math.floor(CW.Util.map(e, 3e3, 1e4, 300, 500))
    }

    function I() {
        var t = a.mouse2d.x, e = a.mouse2d.y;
        L.x = CW.Util.map(t, 0, a.size.width, u.x - w, u.x + w), L.y = CW.Util.map(e, 0, a.size.height, u.y - w, u.y + w), L.z = CW.Util.map(t, 0, a.size.height, u.z - w, u.z + w)
    }

    function M(t, e) {
        a.mouse.x = t / a.size.width * 2 - 1, a.mouse.y = -e / a.size.height * 2 + 1, a.mouse2d.set(t, e)
    }

    function P() {
        a.size.width = window.innerWidth, a.size.height = window.innerHeight, a.camera.aspect = window.innerWidth / window.innerHeight, a.camera.updateProjectionMatrix(), a.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    function D() {
        setTimeout(function () {
            P()
        }, 500)
    }

    this.init = function (t, e, i) {
        var n, o;
        this.dom = t, this.domBgSolid = e, this.domBgGradient = i, this.domHeader = document.getElementById("header"), this.size.width = window.innerWidth, this.size.height = window.innerHeight, a.scene = new THREE.Scene, a.scene.fog = new THREE.Fog(16777215, 2e4, 2e4), a.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1e5), a.camera.position.set(743, 1e3, -377), a.ambiLight = new THREE.AmbientLight(f.ambientColor), a.scene.add(a.ambiLight), a.hemiLight = new THREE.HemisphereLight(v.skyColor, v.groundColor, v.intensity), a.hemiLight.visible = v.visible, a.hemiLight.position.set(v.x, v.y, v.z), a.scene.add(a.hemiLight), a.dirLight = new THREE.DirectionalLight(y.color, y.intensity), a.dirLight.position.set(y.x, y.y, y.z), a.dirLight.castShadow = y.castShadow, a.dirLight.visible = y.visible, a.dirLight.intensity = y.intensity, a.dirLight.shadow.camera.near = 1, a.dirLight.shadow.camera.far = 9e4, a.dirLight.shadow.camera.left = y.shadowCameraLeft, a.dirLight.shadow.camera.right = y.shadowCameraRight, a.dirLight.shadow.camera.top = y.shadowCameraTop, a.dirLight.shadow.camera.bottom = y.shadowCameraBottom, a.dirLight.shadow.mapSize.width = y.shadowMapWidth, a.dirLight.shadow.mapSize.height = y.shadowMapHeight, a.dirLight.shadow.bias = y.shadowBias, a.scene.add(a.dirLight), a.spotLight = new THREE.SpotLight(E.color), a.spotLight.visible = E.visible, a.spotLight.castShadow = E.castShadow, a.spotLight.intensity = E.intensity, a.spotLight.distance = E.distance, a.spotLight.exponent = E.exponent, a.spotLight.decay = E.decay, a.spotLight.angle = E.angle, a.spotLight.shadow.mapSize.width = E.shadowMapWidth, a.spotLight.shadow.mapSize.height = E.shadowMapHeight, a.spotLight.shadow.camera.near = E.shadowCameraNear, a.spotLight.shadow.camera.far = E.shadowCameraFar, a.spotLight.shadow.camera.fov = E.shadowCameraFov, a.spotLight.position.set(E.x, E.y, E.z), a.spotLight.penumbra = .4, a.scene.add(a.spotLight), a.pointLight = new THREE.PointLight(C.color), a.pointLight.visible = C.visible, a.pointLight.castShadow = C.castShadow, a.pointLight.intensity = C.intensity, a.pointLight.distance = C.distance, a.pointLight.decay = C.decay, a.pointLight.position.set(C.x, C.y, C.z), a.scene.add(a.pointLight), n = window.devicePixelRatio, o = !(2 <= n), a.renderer = new THREE.WebGLRenderer({
            antialias: o,
            alpha: !0
        }), a.renderer.setClearColor(16777215, 0), a.renderer.setPixelRatio(n), a.renderer.setSize(window.innerWidth, window.innerHeight), a.renderer.shadowMap.enabled = !0, a.renderer.shadowMap.type = THREE.PCFShadowMap, a.dom.appendChild(a.renderer.domElement), a.control = new THREE.OrbitControls(a.camera, a.renderer.domElement), a.control.target = new THREE.Vector3(0, 0, 0), a.control.enableDamping = !1, a.control.enableKeys = !1, a.control.dampingFactor = .03, a.control.minDistance = 10, a.control.maxDistance = 2e4, a.control.zoomSpeed = .6, a.control.rotateSpeed = .4, a.control.autoRotate = !1, a.control.autoRotateSpeed = .1, a.control.enablePan = !0, a.control.enabled = !1, function () {
            var t = new THREE.PlaneGeometry(1, 1);
            t.rotateX(-Math.PI / 2);
            var e = new THREE.ShadowMaterial;
            e.opacity = .2, a.plane = new THREE.Mesh(t, e), a.plane.name = "plane", a.plane.scale.set(1e4, 1, 1e4), a.plane.receiveShadow = !0, a.plane.position.y = 2, a.scene.add(a.plane)
        }(), window.addEventListener("resize", P), window.addEventListener("orientationchange", D), a.renderer.domElement.addEventListener("mousemove", T), a.renderer.domElement.addEventListener("mousedown", H), a.renderer.domElement.addEventListener("mouseup", x), a.renderer.domElement.addEventListener("mouseout", z), a.renderer.domElement.addEventListener("click", W), a.renderer.domElement.addEventListener("touchstart", b, !1), a.renderer.domElement.addEventListener("touchend", R, !1), a.renderer.domElement.addEventListener("touchmove", S, !1), this.development && (a.stats = new Stats, a.stats.domElement.style.position = "absolute", a.stats.domElement.style.bottom = "0px", a.stats.domElement.style.right = "0px", a.stats.domElement.style.top = "auto", a.stats.domElement.style.left = "auto", a.dom.appendChild(a.stats.domElement)), (s = new CW.Robot).visible = !1, s.actShakeHead(), a.add(s), (h = new CW.Fish(0, 300, 3e3, 50)).velocity.set(0, 0, 0), h.acceleration.set(0, 0, 0), h.cycleAddValue = .09, h.visible = !1, a.add(h)
    }, this.update = function () {
        !function () {
            a.hemiLightHelper && a.hemiLightHelper.update();
            a.dirLightHelper && a.dirLightHelper.update();
            a.spotLightHelper && a.spotLightHelper.update();
            a.pointLightHelper && a.pointLightHelper.update();
            a.cameraHelper && a.cameraHelper.update();
            s.visible && s.update();
            h.visible && h.update();
            m.update(), function () {
                if (a.isControlCamera) {
                    var t = a.camera.position;
                    t.x = t.x + .2 * (L.x - t.x), t.y = t.y + .2 * (L.y - t.y)
                }
            }(), a.control.update(), a.development && a.stats.update()
        }(), a.renderer.render(a.scene, a.camera)
    }, this.showHeader = function () {
        var t;
        TweenLite.set(this.domHeader, {display: "block"}), t = document.getElementById("headerIcon"), CW.Util.forEach(t.children, function (t, e) {
            TweenLite.killTweensOf(t), TweenLite.set(t, {opacity: 0}), TweenLite.to(t, .8, {
                delay: .05 + .05 * e,
                opacity: 1
            })
        })
    }, this.hideHeader = function () {
        TweenLite.set(this.domHeader, {display: "none"})
    }, this.changeColorLogo = function (i) {
        i = i || "#ffffff";
        var t = document.getElementById("headerIcon");
        CW.Util.forEach(t.children, function (t, e) {
            TweenLite.killTweensOf(t), TweenLite.to(t, .8, {delay: .1 * e, fill: i})
        })
    }, this.setBackColor = function (t) {
        TweenLite.set(this.domBgSolid, {backgroundColor: t})
    }, this.changeBackColor = function (t, e, i) {
        i = i || 1;
        TweenLite.to(this.domBgSolid, i, {
            backgroundColor: t, onComplete: function () {
                e && e()
            }
        })
    }, this.showBackGradient = function (t) {
        t = t || 1;
        TweenLite.set(this.domBgGradient, {display: "block"}), TweenLite.to(this.domBgGradient, t, {
            delay: .01,
            opacity: 1
        })
    }, this.hideBackGradient = function (t) {
        t = t || 1;
        var e = this;
        TweenLite.to(this.domBgGradient, t, {
            delay: .01, opacity: 0, onComplete: function () {
                TweenLite.set(e.domBgGradient, {display: "none"})
            }
        })
    }, this.add = function (t) {
        this.scene.add(t)
    }, this.remove = function (t) {
        this.scene.remove(t)
    }, this.getRobot = function () {
        return s
    }, this.getFriend = function () {
        return h
    }, this.intersectObject = function (t) {
        i.setFromCamera(this.mouse, this.camera);
        var e = i.intersectObject(t);
        return 0 < e.length ? e[0] : null
    }, this.intersectObjects = function (t) {
        i.setFromCamera(this.mouse, this.camera);
        var e = i.intersectObjects(t);
        return 0 < e.length ? e[0] : null
    }, this.setCameraPosition = function (t, e, i) {
        a.camera.position.set(t, e, i), u.set(t, e, i), B(), I()
    }, this.changeCameraPosition = function (t, e, i, n) {
        this.isControlCamera = !1, n = n || 2, TweenLite.killTweensOf(u), TweenLite.to(this.camera.position, n, {
            x: t,
            y: e,
            z: i,
            ease: Sine.easeInOut
        }), TweenLite.to(u, n, {x: t, y: e, z: i, ease: Sine.easeInOut}), TweenLite.to(L, n, {
            x: t,
            y: e,
            z: i,
            ease: Sine.easeInOut,
            onComplete: function () {
                B(), a.isControlCamera = !0
            }
        })
    }, this.changeFogNear = function (t, e) {
        e = e || 2, TweenLite.to(a.scene.fog, e, {near: t})
    }, this.changeFogFar = function (t, e) {
        e = e || 2, TweenLite.to(a.scene.fog, e, {far: t})
    }, this.changeFogColor = function (t, e) {
        var i = {color: "#" + a.scene.fog.color.getHexString()};
        e = e || 2, TweenLite.to(i, e, {
            color: t, onUpdate: function () {
                a.scene.fog.color.set(i.color)
            }
        })
    }, this.setCursor = function (t) {
        t ? e.classList.add("cursorPointer") : e.classList.remove("cursorPointer")
    }, this.addIndicator = function (t, e, i, n) {
        m.add(t, e, i, n)
    }, this.addDragIndicator = function (t, e, i, n) {
        m.addDrag(t, e, i, n)
    }, this.removeIndicator = function (t) {
        m.remove(t)
    }, this.setAmbiLightColor = function (t) {
        this.ambiLight.color.set(t)
    }, this.setAmbiLightIntensity = function (t) {
        this.ambiLight.intensity = t
    }, this.changeAmbiLightColor = function (t) {
        var e = {color: "#" + this.ambiLight.color.getHexString()};
        TweenLite.to(e, 1, {
            color: t, onUpdate: function () {
                a.ambiLight.color.set(e.color)
            }
        })
    }, this.changeAmbiLightIntensity = function (t) {
        TweenLite.to(this.ambiLight, 1, {intensity: t})
    }, this.changeSpotLightColor = function (t) {
        var e = {color: "#" + this.spotLight.color.getHexString()};
        TweenLite.to(e, 1, {
            color: t, onUpdate: function () {
                a.spotLight.color.set(e.color)
            }
        })
    }, this.changeSpotLightIntensity = function (t) {
        TweenLite.to(this.spotLight, 1, {intensity: t})
    }, this.changeSpotLightDecay = function (t) {
        TweenLite.to(this.spotLight, 1, {decay: t})
    }, this.changeSpotLightAngle = function (t) {
        TweenLite.to(this.spotLight, 1, {angle: t})
    }, this.changeSpotLightDistance = function (t) {
        TweenLite.to(this.spotLight, 1, {distance: t})
    }, this.changeSpotLightPenumbra = function (t) {
        TweenLite.to(this.spotLight, 1, {penumbra: t})
    }, this.changeSpotLightPosition = function (t, e, i) {
        TweenLite.to(this.spotLight.position, 1, {x: t, y: e, z: i})
    }, this.setSpotLightColor = function (t) {
        this.spotLight.color.set(t)
    }, this.setSpotLightIntensity = function (t) {
        this.spotLight.intensity = t
    }, this.setSpotLightDecay = function (t) {
        this.spotLight.decay = t
    }, this.setSpotLightAngle = function (t) {
        this.spotLight.angle = t
    }, this.setSpotLightDistance = function (t) {
        this.spotLight.distance = t
    }, this.setSpotLightPenumbra = function (t) {
        this.spotLight.penumbra = t
    }, this.setSpotLightPosition = function (t, e, i) {
        this.spotLight.position.set(t, e, i)
    }, this.changeHemiLightColor = function (t) {
        var e = {color: "#" + this.hemiLight.color.getHexString()};
        TweenLite.to(e, 1, {
            color: t, onUpdate: function () {
                a.hemiLight.color.set(e.color)
            }
        })
    }, this.changeHemiLightGroundColor = function (t) {
        var e = {color: "#" + this.hemiLight.groundColor.getHexString()};
        TweenLite.to(e, 1, {
            color: t, onUpdate: function () {
                a.hemiLight.groundColor.set(e.color)
            }
        })
    }, this.changeHemiLightIntensity = function (t) {
        TweenLite.to(this.hemiLight, 1, {intensity: t})
    }, this.setHemiLightColor = function (t) {
        this.hemiLight.color.set(t)
    }, this.setHemiLightGroundColor = function (t) {
        this.hemiLight.groundColor.set(t)
    }, this.setHemiLightIntensity = function (t) {
        this.hemiLight.intensity = t
    }
}, CW.Stage.prototype = Object.create(CW.EventDispatcher.prototype), CW.Stage.prototype.constructor = CW.Stage;
CW.Util = {}, CW.Util.forEach = function (t, r) {
    for (var n = 0, o = t.length; n < o; n++) r(t[n], n)
}, CW.Util.forEachReverse = function (t, r) {
    for (var n = t.length - 1; 0 <= n; n--) r(t[n], n)
}, CW.Util.random = function (t, r) {
    if (r < t) {
        var n = r;
        r = t, t = n
    }
    return Math.random() * (r - t) + t
}, CW.Util.randomFloor = function (t, r) {
    return Math.floor(CW.Util.random(t, r))
}, CW.Util.degToRad = function (t) {
    return t * Math.PI / 180
}, CW.Util.radToDeg = function (t) {
    return 180 * t / Math.PI
}, CW.Util.distance = function (t, r, n, o) {
    return Math.sqrt(Math.pow(n - t, 2) + Math.pow(o - r, 2))
}, CW.Util.distanceVector3 = function (t, r) {
    var n, o, a;
    return function (t, r) {
        return n = r.x - t.x, o = r.y - t.y, a = r.z - t.z, Math.sqrt(n * n + o * o + a * a)
    }
}(), CW.Util.distanceSimpleVector3 = function (t, r) {
    var n, o, a;
    return function (t, r) {
        return n = r.x - t.x, o = r.y - t.y, a = r.z - t.z, n * n + o * o + a * a
    }
}(), CW.Util.bbGeo = function (t, r, n) {
    return new THREE.BoxBufferGeometry(t, r, n)
}, CW.Util.getRandomColor = function () {
    for (var t = "#", r = 0; r < 6; r++) t += "0123456789ABCDEF"[Math.floor(16 * Math.random())];
    return t
}, CW.Util.shuffle = function (t) {
    var r, n, o;
    for (o = t.length; o; o -= 1) r = Math.floor(Math.random() * o), n = t[o - 1], t[o - 1] = t[r], t[r] = n
}, CW.Util.getGrayMaterial = function () {
}, CW.Util.getGrayBasicMaterial = function () {
    var t = Math.round(CW.Util.random(50, 150));
    return new THREE.MeshBasicMaterial({color: "rgb(" + t + "," + t + ", " + t + ")"})
}, CW.Util.getGrayPhongMaterial = function () {
    var t = Math.round(CW.Util.random(50, 100));
    return new THREE.MeshPhongMaterial({flatShading: !0, color: "rgb(" + t + "," + t + ", " + t + ")"})
}, CW.Util.getGrayLambertMaterial = function () {
    var t = Math.round(CW.Util.random(50, 150));
    return new THREE.MeshLambertMaterial({color: "rgb(" + t + "," + t + ", " + t + ")"})
}, CW.Util.getCenterOfTriangle = function () {
    var o = new THREE.Vector3;
    return function (t, r, n) {
        return o.x = (t.x + r.x + n.x) / 3, o.y = (t.y + r.y + n.y) / 3, o.z = (t.z + r.z + n.z) / 3, o
    }
}(), CW.Util.getBoxGeo = function () {
    return new THREE.BoxBufferGeometry(1, 1, 1)
}, CW.Util.getBoxGeoBottom = function () {
    var t = CW.Util.getBoxGeo();
    return t.applyMatrix((new THREE.Matrix4).makeTranslation(0, .5, 0)), t
}, CW.Util.getBoxGeoTop = function () {
    var t = CW.Util.getBoxGeo();
    return t.applyMatrix((new THREE.Matrix4).makeTranslation(0, -.5, 0)), t
}, CW.Util.constrain = function (t, r, n) {
    return Math.min(Math.max(t, r), n)
}, CW.Util.map = function (t, r, n, o, a) {
    return o + (t - r) / (n - r) * (a - o)
}, CW.Util.pickHex = function (t, r, n) {
    var o = ((2 * n - 1) / 1 + 1) / 2, a = 1 - o;
    return [Math.round(r[0] * o + t[0] * a), Math.round(r[1] * o + t[1] * a), Math.round(r[2] * o + t[2] * a)]
}, CW.Util.getColorDecimal = function (t) {
    return t = t.replace("#", "0x"), [(t = Math.floor(t)) >> 16 & 255, t >> 8 & 255, 255 & t]
}, CW.Util.getColorFromGradient = function (t, r, n) {
    t = CW.Util.getColorDecimal(t), r = CW.Util.getColorDecimal(r);
    var o = ((2 * n - 1) / 1 + 1) / 2, a = 1 - o;
    return [Math.round(r[0] * o + t[0] * a), Math.round(r[1] * o + t[1] * a), Math.round(r[2] * o + t[2] * a)]
}, CW.Util.getColorRgb = function (t, r, n) {
    var o = CW.Util.getColorFromGradient(t, r, n);
    return "rgb(" + o[0] + ", " + o[1] + ", " + o[2] + ")"
}, CW.Util.sceneDetach = function (t, r, n) {
    t.applyMatrix(r.matrixWorld), r.remove(t), n.add(t)
}, CW.Util.attach = function (t, r, n) {
    t.applyMatrix((new THREE.Matrix4).getInverse(n.matrixWorld)), r.remove(t), n.add(t)
};
CW.Scene = function (e) {
    CW.EventDispatcher.call(this), this.finishEvent = {type: "finish"}
}, CW.Scene.prototype = Object.create(CW.EventDispatcher.prototype), CW.Scene.prototype.constructor = CW.Scene, CW.Scene.prototype.ready = function () {
}, CW.Scene.prototype.start = function () {
}, CW.Scene.prototype.stop = function () {
}, CW.Scene.prototype.reset = function () {
}, CW.Scene.prototype.update = function () {
};
CW.SceneBridge = function (n) {
    CW.Scene.call(this), this.name = "SceneBridge";
    var t, i, o, c = this, e = CW.SceneBridge.sceneColor, a = {
        WAIT_FOR_CLOSE: "WAIT_FOR_CLOSE",
        DEFAULT: "DEFAULT",
        FALL_LEVER: "FALL_LEVER",
        WAIT_CLICK_LEVER: "WAIT_CLICK_LEVER",
        SHOW_BRIDGE: "SHOW_BRIDGE",
        WALK: "WALK",
        HIDE_BRIDGE: "HIDE_BRIDGE",
        END: "END"
    }, s = a.DEFAULT, r = 0;

    function E(e) {
        switch (s = e, log("@state", s), s) {
            case a.DEFAULT:
            case a.WAIT_FOR_CLOSE:
                break;
            case a.FALL_LEVER:
                i.visible = !0, i.fall(function () {
                    E(a.WAIT_CLICK_LEVER)
                });
                break;
            case a.WAIT_CLICK_LEVER:
                n.addIndicator(i.position, new THREE.Vector3(-100, 0, 0));
                break;
            case a.SHOW_BRIDGE:
                TweenLite.delayedCall(.8, function () {
                    i.goUp(function () {
                        n.remove(i)
                    })
                }), t.visible = !0, TweenLite.delayedCall(.9, function () {
                    t.show(), E(a.WALK)
                });
                break;
            case a.WALK:
                o.visible = !0, o.headAndNeck.actShake(), o.actRun();
                break;
            case a.HIDE_BRIDGE:
                o.visible = !1, t.hide(function () {
                    n.remove(t), t = null
                }), TweenLite.delayedCall(6, function () {
                    E(a.END)
                });
                break;
            case a.END:
                n.removeEventListener("click", L), n.removeEventListener("mousemove", C), n.removeEventListener("touchstart", d, !1), o = i = null, setTimeout(function () {
                    c.dispatchEvent(c.finishEvent)
                }, 10)
        }
    }

    function L() {
        l()
    }

    function d(e) {
        l()
    }

    function l() {
        s === a.WAIT_CLICK_LEVER && n.intersectObject(i.boundingBox) && (i.pull(), n.removeIndicator(), n.setCursor(!1), E(a.SHOW_BRIDGE))
    }

    function C(e) {
        s === a.WAIT_CLICK_LEVER && n.setCursor(n.intersectObject(i.boundingBox))
    }

    this.init = function () {
        (t = new CW.Bridge).position.z = -2e3, (i = new CW.BridgeLever).position.set(-300, 2e3, 0)
    }, this.start = function () {
        log("#SceneBridge start"), n.setCameraPosition(-1254, 3216, -1842), n.plane.visible = !1, n.changeFogColor(e, 2), n.changeFogNear(2300, 1), n.changeFogFar(4500, 1), (o = n.getRobot()).visible = !1, o.position.set(0, 0, -2e3), n.hideBackGradient(3), n.changeBackColor(e, function () {
            t.visible = !1, n.add(t), n.add(i), n.addEventListener("click", L), n.addEventListener("mousemove", C), n.addEventListener("touchstart", d, !1), E(a.FALL_LEVER)
        }, 1)
    }, this.update = function () {
        t && t.update(), s === a.WALK && (r += .02, r = CW.Util.constrain(r, 0, 6), o.position.z += r, 2500 < o.position.z && E(a.HIDE_BRIDGE))
    }
}, CW.SceneBridge.prototype = Object.create(CW.Scene.prototype), CW.SceneBridge.prototype.constructor = CW.SceneBridge, CW.SceneBridge.sceneColor = "#1f2e3a";
CW.SceneConstructRobot = function (o) {
    CW.Scene.call(this), this.name = "SceneConstructRobot";
    var n, i, r, a, s, c, d, E, u, l, T, C, p, R, w, m, L, b, t, h = this, e = CW.SceneTitle.sceneColor, f = {
            DEFAULT: "DEFAULT",
            WAIT_FOR_CLOSE: "WAIT_FOR_CLOSE",
            FALLING: "FALLING",
            CONSTRUCT: "CONSTRUCT",
            COMPLETE_CONSTRUCT: "COMPLETE_CONSTRUCT",
            LEAVE: "LEAVE",
            END: "END"
        }, v = f.DEFAULT, y = 0, O = 4, W = !1, g = null, x = [], A = [], U = null, H = new THREE.Vector3,
        S = new THREE.Vector3, B = new THREE.Vector3(0, -.1, 0), N = 0, I = .01, P = 3;

    function z(e) {
        switch (v = e, log("@state", v), v) {
            case f.DEFAULT:
            case f.FALLING:
                break;
            case f.CONSTRUCT:
                o.addEventListener("mousemove", V), o.addEventListener("mousedown", F), o.addEventListener("mouseup", j), o.addEventListener("mouseout", X), o.addEventListener("touchstart", G, !1), o.addEventListener("touchend", Y, !1), o.addEventListener("touchmove", _, !1), o.addDragIndicator(a, new THREE.Vector3(0, 0, 50), new THREE.Vector3(0, 0, -200), "DRAG");
                break;
            case f.COMPLETE_CONSTRUCT:
                k(), o.remove(b), o.remove(n), o.remove(i), o.remove(r), o.remove(a), o.remove(s), o.remove(L), x = g = m = w = R = p = C = T = l = u = E = d = c = L = s = a = r = i = n = b = null, t.position.set(0, 0, -200), t.visible = !0, TweenLite.delayedCall(.3, function () {
                    z(f.LEAVE)
                });
                break;
            case f.LEAVE:
                t.actWalk();
                break;
            case f.END:
                t = null, o.isControlCamera = !0, h.dispatchEvent(h.finishEvent)
        }
    }

    function k() {
        o.removeEventListener("mousemove", V), o.removeEventListener("mousedown", F), o.removeEventListener("mouseup", j), o.removeEventListener("mouseout", X), o.removeEventListener("touchstart", G, !1), o.removeEventListener("touchend", Y, !1), o.removeEventListener("touchmove", _, !1)
    }

    function F(e) {
        v === f.CONSTRUCT && M()
    }

    function G(e) {
        v === f.CONSTRUCT && M()
    }

    function M() {
        var e = o.intersectObject(g);
        if (e) {
            W = !0, L.show(), U = e.object._parent, TweenLite.to(U.outerGroup.position, .5, {
                y: 40,
                ease: Power2.easeInOut
            });
            var t = o.intersectObject(b);
            t && (H.copy(t.point), S.copy(H).sub(U.position))
        }
    }

    function V(e) {
        v === f.CONSTRUCT && (W ? D() : o.setCursor(!!o.intersectObject(g)))
    }

    function _(e) {
        v === f.CONSTRUCT && W && D()
    }

    function D() {
        var e = o.intersectObject(b);
        e && (H.copy(e.point), o.intersectObject(C) ? L.over() : L.out())
    }

    function j(e) {
        W && Z(), o.setCursor(!1), L.hide()
    }

    function X() {
        W = !1, U = null, H.set(0, 0, 0), S.set(0, 0, 0), L.hide()
    }

    function Y(e) {
        W && Z()
    }

    function Z() {
        W && (L.hide(), o.intersectObject(C) ? function () {
            if (O <= y) return;
            switch (y += 1, g = x.splice(0, 1)[0], U.reset(), o.removeIndicator(), y) {
                case 1:
                    log("assembleLeg"), n._box.scale.y = 210, n._box.position.y = 140, n.isAssembled = !0, a.isAssembled = !0, TweenLite.to(n.position, 1, {
                        y: 70,
                        ease: Back.easeInOut
                    }), TweenLite.to(a.position, .4, {
                        delay: .05,
                        x: 0,
                        y: 43,
                        z: -200,
                        ease: Back.easeInOut
                    }), o.addDragIndicator(s, new THREE.Vector3(-50, 0, 0), new THREE.Vector3(0, 0, -200));
                    break;
                case 2:
                    log("assembleWheel"), n._box.scale.y = 243, s.isAssembled = !0, TweenLite.to(n.position, .6, {
                        y: 110,
                        ease: Back.easeInOut
                    }), TweenLite.to(a.position, .6, {
                        delay: .05,
                        y: 85,
                        ease: Back.easeInOut
                    }), TweenLite.to(s.position, .6, {
                        x: 0,
                        z: -200,
                        y: 48,
                        ease: Power2.easeInOut
                    }), o.addDragIndicator(i, new THREE.Vector3(50, 0, 0), new THREE.Vector3(0, 0, -200));
                    break;
                case 3:
                    log("assembleLeftArm"), i.isAssembled = !0, TweenLite.to(i.position, .6, {
                        x: 28,
                        y: 124,
                        z: -200,
                        ease: Power2.easeInOut
                    }), o.addDragIndicator(r, new THREE.Vector3(0, 0, -50), new THREE.Vector3(0, 0, -200));
                    break;
                case 4:
                    log("assembleRightArm"), r.isAssembled = !0, z(f.WAIT_FOR_CLOSE), TweenLite.to(r.position, .6, {
                        x: -28,
                        y: 124,
                        z: -200,
                        ease: Power2.easeInOut,
                        onComplete: function () {
                            z(f.COMPLETE_CONSTRUCT)
                        }
                    })
            }
        }() : (TweenLite.killTweensOf(U._origin.position), TweenLite.to(U.outerGroup.position, .5, {
            y: 0,
            ease: Power2.easeInOut
        })), W = !1, U = null, H.set(0, 0, 0), S.set(0, 0, 0))
    }

    this.init = function () {
        var e, t;
        (b = new THREE.Mesh(new THREE.PlaneBufferGeometry(1e4, 1e4, 2, 2).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({
            color: 255,
            wireframe: !0,
            visible: !1
        }))).position.y = 0, n = new CW.Robot.Part("bodyPart"), i = new CW.Robot.Part("leftArmPart"), r = new CW.Robot.Part("rightArmPart"), a = new CW.Robot.Part("legPart"), s = new CW.Robot.Part("wheelPart"), a.innerGroup.rotation.x = CW.Util.degToRad(-80), s.innerGroup.rotation.z = CW.Util.degToRad(-80), i.innerGroup.rotation.z = CW.Util.degToRad(80), r.innerGroup.rotation.x = CW.Util.degToRad(80), A = [n, a, s, i, r], (c = new CW.Robot.HeadAndNeck).position.set(0, 42, 0), c._positionY = c.position.y, n.addOrigin(c), d = new CW.Robot.Body, n.addOrigin(d), (E = new CW.Robot.Arm("left")).position.y = -17, i.addOrigin(E), (u = new CW.Robot.Arm("right")).position.y = -17, r.addOrigin(u), (l = new CW.Robot.LowerBody).wheel.visible = !1, a.addOrigin(l), (T = new CW.Robot.Wheel).position.y = -43, s.addOrigin(T), e = new THREE.MeshBasicMaterial({
            color: 16711680,
            wireframe: !0,
            visible: !1
        }), (t = new THREE.BoxBufferGeometry(1, 1, 1)).applyMatrix((new THREE.Matrix4).makeTranslation(0, -.5, 0)), (C = new THREE.Mesh(t, e)).scale.set(150, 160, 70), C.position.y = 150, n.addBox(C), t = new THREE.BoxBufferGeometry(44, 82, 40), (p = new THREE.Mesh(t, e)).position.set(9, -41, 0), i.addBox(p), t = new THREE.BoxBufferGeometry(44, 82, 40), (R = new THREE.Mesh(t, e)).position.set(-9, -41, 0), r.addBox(R), (t = new THREE.BoxBufferGeometry(48, 82, 24)).applyMatrix((new THREE.Matrix4).makeTranslation(0, -41, 0)), (w = new THREE.Mesh(t, e)).position.set(0, 0, 0), a.addBox(w), t = new THREE.BoxBufferGeometry(48, 86, 80), (m = new THREE.Mesh(t, e)).position.set(0, -43, 0), s.addBox(m), g = w, x.push(m), x.push(p), x.push(R), (L = new CW.Robot.DropZone(140, 4, 70, 4)).position.z = -200, function () {
            var o = [{x: 0, z: -200}, {x: -200, z: -100}, {x: -50, z: 60}, {x: 10, z: 50}, {x: 160, z: 220}];
            CW.Util.degToRad(CW.Util.random(-90, 0));
            CW.Util.forEach(A, function (e, t) {
                CW.Util.degToRad(CW.Util.random(60, 90)), CW.Util.random(20, 40), e.position.x = o[t].x, e.position.z = o[t].z, e.position.y = CW.Util.random(800, 1e3), "bodyPart" === e.name && (e.outerGroup.rotation.x = -.2)
            })
        }()
    }, this.start = function () {
        log("#SceneConstructRobot start"), o.add(b), o.add(n), o.add(i), o.add(r), o.add(a), o.add(s), o.add(L), o.isControlCamera = !1, o.setBackColor(e), o.showBackGradient(1), o.setCameraPosition(678, 1178, 831), o.dirLight.position.set(-616, 399, 222), o.changeFogColor(e, 1), o.changeFogNear(600, 1), o.changeFogFar(4e3, 1), t = o.getRobot(), c.actShake(), z(f.FALLING), o.showHeader()
    }, this.update = function () {
        v === f.FALLING ? function () {
            c.update();
            var o = !0;
            CW.Util.forEach(A, function (e) {
                if (!e.attachedFloor) {
                    o = !1;
                    var t = e.velocity.clone();
                    t.multiplyScalar(-1), t.normalize(), t.multiplyScalar(.01), e.applyForce(t), B.set(0, -.1 * e.mass, 0), e.applyForce(B), e.checkFloor(), e.update()
                }
            }), o && z(f.CONSTRUCT)
        }() : v === f.CONSTRUCT ? function () {
            if (c.update(), W) {
                var e = H.clone().sub(S), t = U.position;
                t.x = t.x + .2 * (e.x - t.x), t.y = t.y + .2 * (e.y - t.y), t.z = t.z + .2 * (e.z - t.z), U.update()
            }
        }() : v === f.LEAVE && (N += I, N = CW.Util.constrain(N, 0, P), t.position.z += N, 830 < t.position.z && z(f.END))
    }, this.stop = function () {
        k()
    }
}, CW.SceneConstructRobot.prototype = Object.create(CW.Scene.prototype), CW.SceneConstructRobot.prototype.constructor = CW.SceneConstructRobot;
CW.SceneEat = function (t) {
    CW.Scene.call(this), this.name = "SceneEat";
    var a, n, o = this, e = CW.SceneEat.sceneColor, i = {DEFAULT: "DEFAULT", EAT: "EAT", END: "END"}, r = i.DEFAULT,
        s = [], c = 0, d = -1;

    function l(e) {
        switch (r = e, log("@state", r), r) {
            case i.DEFAULT:
                break;
            case i.EAT:
                s[d = 0].chase();
                break;
            case i.END:
                CW.Util.forEach(s, function (e) {
                    e.removeEventListener("swallow", u), e.addEventListener("return", h), t.remove(e)
                }), n = a = s = null, setTimeout(function () {
                    o.dispatchEvent(o.finishEvent)
                }, 10)
        }
    }

    function E() {
        switch (d) {
            case 0:
                var e = CW.Util.degToRad(-140);
                n.rightArm.actBottomReach(), n.leftArm.actBottomReach(), TweenLite.to(n.rotation, .8, {
                    y: e,
                    ease: Sine.easeInOut
                });
                break;
            case 1:
                e = CW.Util.degToRad(-250);
                n.raiseHead(10, .8), TweenLite.to(n.rotation, .8, {y: e, ease: Sine.easeInOut});
                break;
            case 2:
                e = CW.Util.degToRad(-50);
                TweenLite.to(n.rotation, .8, {y: e, ease: Sine.easeInOut});
                break;
            case 3:
                e = CW.Util.degToRad(-30);
                TweenLite.to(n.rotation, .8, {y: e, ease: Sine.easeInOut}), n.lowerHead(10, .5);
                break;
            case 4:
                e = CW.Util.degToRad(50);
                TweenLite.to(n.rotation, .8, {y: e, ease: Sine.easeInOut}), n.aheadHead(.5)
        }
    }

    function u() {
        (d += 1) > s.length - 1 || s[d].chase()
    }

    function h() {
        (c += 1) >= s.length && l(i.END)
    }

    this.init = function () {
        var a;
        CW.Util.forEach([{
            radius: 900,
            pos: {x: -3e3, y: 100, z: -3e3},
            target: {x: -850, y: 200, z: -900}
        }, {radius: 500, pos: {x: 3e3, y: 500, z: -2200}, target: {x: 740, y: 100, z: -400}}, {
            radius: 400,
            pos: {x: -2e3, y: 100, z: 3e3},
            target: {x: -700, y: 0, z: 470}
        }, {radius: 600, pos: {x: -1400, y: -2700, z: 900}, target: {x: -800, y: -600, z: 600}}, {
            radius: 700,
            pos: {x: 2e3, y: -1700, z: 2e3},
            target: {x: 800, y: -300, z: 700}
        }], function (e, t) {
            (a = new CW.EatingMonster(e.radius)).position.set(e.pos.x, e.pos.y, e.pos.z), a.setTarget(e.target.x, e.target.y, e.target.z), a.lookAtTarget(), s.push(a), a.addEventListener("eat", E), a.addEventListener("swallow", u), a.addEventListener("return", h)
        })
    }, this.start = function () {
        log("#SceneEat start"), t.changeBackColor(e), t.setCameraPosition(2377, 2901, 4671, 1.5), t.changeFogColor(e, 2), t.changeFogNear(4300, 2), t.changeFogFar(7e3, 2), (a = t.scene.getObjectByName("SceneEatFloor")) || ((a = new THREE.Mesh(new THREE.BoxGeometry(1200, 600, 1200), new THREE.MeshPhongMaterial({
            color: CW.RainyFloor.finalColor,
            flatShading: !0
        }))).position.y = -300, a.name = "SceneEatFloor", t.add(a)), CW.Util.forEach(s, function (e) {
            e.setFood(a)
        }), CW.Util.forEach(s, function (e) {
            t.add(e)
        }), (n = t.getRobot()).visible = !0, n.actStand(), n.position.set(0, 0, 0), n.aheadHead(1), TweenLite.delayedCall(2, function () {
            l(i.EAT)
        })
    }, this.update = function () {
        s && CW.Util.forEach(s, function (e, t) {
            e.update()
        })
    }
}, CW.SceneEat.prototype = Object.create(CW.Scene.prototype), CW.SceneEat.prototype.constructor = CW.SceneEat, CW.SceneEat.sceneColor = "#504a4c";
CW.SceneFloatingIsland = function (t) {
    CW.Scene.call(this), this.name = "SceneFloatingIsland";
    var o, n, i = this, l = CW.SceneFloatingIsland.sceneColor, a = {
        DEFAULT: "DEFAULT",
        FLOAT_A_LITTLE: "FLOAT_A_LITTLE",
        SHOW_ISLAND: "SHOW_ISLAND",
        UP: "UP",
        DOWN_TO_CENTER: "DOWN_TO_CENTER",
        SHOW_BOXES: "SHOW_BOXES",
        WAIT_CLICK_ISLAND: "WAIT_CLICK_ISLAND",
        SINK_ISLAND: "SINK_ISLAND",
        LEAVE_ROBOT: "LEAVE_ROBOT",
        HIDE_ISLAND: "HIDE_ISLAND",
        END: "END"
    }, s = a.DEFAULT, L = [];

    function r(e) {
        switch (s = e, log("@state", s), s) {
            case a.DEFAULT:
                break;
            case a.FLOAT_A_LITTLE:
                TweenLite.delayedCall(1.5, function () {
                    o.floatALittle()
                }), TweenLite.to(robot.position, 3, {
                    y: 400,
                    ease: Sine.easeInOut
                }), TweenLite.to(o.position, 3, {
                    y: 400, ease: Sine.easeInOut, onComplete: function () {
                        r(a.SHOW_ISLAND)
                    }
                });
                break;
            case a.SHOW_ISLAND:
                o.show(function () {
                    r(a.UP)
                });
                break;
            case a.UP:
                TweenLite.to(robot.position, 4, {y: 6e3, ease: Sine.easeInOut}), TweenLite.to(o.position, 4, {
                    y: 6e3,
                    ease: Sine.easeInOut,
                    onComplete: function () {
                        r(a.DOWN_TO_CENTER)
                    }
                }), setTimeout(function () {
                    r(a.SHOW_BOXES)
                }, 0), TweenLite.to(n.position, 3, {
                    y: -4e3, ease: Power1.easeInOut, onComplete: function () {
                        t.remove(n), n = null
                    }
                });
                break;
            case a.DOWN_TO_CENTER:
                t.changeFogNear(5e3, 2), robot.actStand(), robot.raiseHead(40, 1), robot.rotation.y = 0, robot.position.y = -3e3, o.position.y = -3e3, TweenLite.to(robot.position, 4, {
                    y: 0,
                    ease: Sine.easeInOut
                }), TweenLite.to(o.position, 4, {
                    y: 0, ease: Sine.easeInOut, onComplete: function () {
                        r(a.WAIT_CLICK_ISLAND)
                    }
                });
                break;
            case a.SHOW_BOXES:
                CW.Util.forEach(L, function (e, o) {
                    e.visible = !0, e.isMoving = !0
                });
                break;
            case a.WAIT_CLICK_ISLAND:
                t.addIndicator(o.position, new THREE.Vector3(0, -200, 0));
                break;
            case a.SINK_ISLAND:
                robot.aheadHead(1.5), CW.Util.forEach(L, function (e, o) {
                    e.isMoving = !1, TweenLite.to(e.position, 3, {
                        y: -5e3,
                        ease: Power2.easeInOut,
                        onComplete: function () {
                            e.visible = !1
                        }
                    })
                }), TweenLite.delayedCall(2.5, function () {
                    o.sink(function () {
                        r(a.LEAVE_ROBOT)
                    })
                });
                break;
            case a.LEAVE_ROBOT:
                t.plane.visible = !0, robot.actRun(), TweenLite.to(robot.position, 7, {
                    z: 3500,
                    ease: Sine.easeInOut
                }), TweenLite.delayedCall(5.1, function () {
                    r(a.HIDE_ISLAND)
                });
                break;
            case a.HIDE_ISLAND:
                o.hide(function () {
                    r(a.END)
                });
                break;
            case a.END:
                t.removeEventListener("click", c), t.removeEventListener("mousemove", d), t.removeEventListener("touchstart", I, !1), t.remove(o), CW.Util.forEach(L, function (e, o) {
                    t.remove(e)
                }), o = null, box = null, setTimeout(function () {
                    i.dispatchEvent(i.finishEvent)
                }, 10)
        }
    }

    function c() {
        E()
    }

    function I(e) {
        E()
    }

    function E() {
        s === a.WAIT_CLICK_ISLAND && t.intersectObject(o.boundingBox) && (t.setCursor(!1), t.removeIndicator(), r(a.SINK_ISLAND))
    }

    function d(e) {
        s === a.WAIT_CLICK_ISLAND && t.setCursor(t.intersectObject(o.boundingBox))
    }

    this.init = function () {
        (o = new CW.FloatingIsland(3e3, 3e3, 100)).position.y = -5, function () {
            for (var e = 0; e < 80; e++) {
                var o = CW.Util.random(200, 900), t = CW.Util.random(800, 2e3), n = CW.Util.random(200, 800),
                    i = CW.Util.random(-2600, 2600), a = CW.Util.random(3e3, 8e3), s = CW.Util.random(-500, -2e3),
                    r = (Math.floor(CW.Util.random(10, 30)), 16777215 * Math.random());
                Math.random(), Math.random(), Math.PI, Math.PI;
                r = l, 16777215, 6;
                var c = new CW.BorderBox(o, t, n, r, 16777215, 6);
                c.position.set(i, a, s), c.visible = !1, c.acceleration = new THREE.Vector3(0, -CW.Util.random(.3, 1.5), 0), c.velocity = new THREE.Vector3(0, -1, 0), L.push(c)
            }
        }()
    }, this.start = function () {
        log("#SceneFloatingIsland start"), t.changeBackColor(l), t.setCameraPosition(2377, 2901, 4671), t.dirLight.position.set(1338, 2882, 3955), t.plane.visible = !1, t.changeFogColor(l, 1), t.changeFogNear(2e3, 1), t.changeFogFar(9e3, 1), (n = t.scene.getObjectByName("SceneEatFloor")) || ((n = new THREE.Mesh(new THREE.BoxGeometry(1200, 600, 1200), new THREE.MeshPhongMaterial({
            color: CW.RainyFloor.finalColor,
            flatShading: !0
        }))).position.y = -300, n.name = "SceneEatFloor", t.add(n)), t.add(o), CW.Util.forEach(L, function (e) {
            t.add(e)
        }), t.addEventListener("click", c), t.addEventListener("mousemove", d), t.addEventListener("touchstart", I, !1), robot = t.getRobot(), robot.visible = !0, robot.headAndNeck.actShake(), TweenLite.delayedCall(2, function () {
            r(a.FLOAT_A_LITTLE)
        })
    }, this.update = function () {
        o && o.update(), L && CW.Util.forEach(L, function (e, o) {
            e.update()
        })
    }
}, CW.SceneFloatingIsland.prototype = Object.create(CW.Scene.prototype), CW.SceneFloatingIsland.prototype.constructor = CW.SceneFloatingIsland, CW.SceneFloatingIsland.sceneColor = "#6c567b";
CW.SceneGhost = function (c) {
    CW.Scene.call(this), this.name = "SceneGhost";
    var E, s, l = this, o = "#555273", T = {
            DEFAULT: "DEFAULT",
            WALK_EGGS: "WALK_EGGS",
            WALK_ROBOT: "WALK_ROBOT",
            SHOW_GHOSTS: "SHOW_GHOSTS",
            WAIT_CLICK_FRIEND: "WAIT_CLICK_FRIEND",
            RED_FRIEND: "RED_FRIEND",
            CRUMPLE_GHOSTS: "CRUMPLE_GHOSTS",
            ORIGIN_FRIEND: "ORIGIN_FRIEND",
            SINK_GHOSTS: "SINK_GHOSTS",
            LEAVE: "LEAVE",
            END: "END"
        }, f = T.DEFAULT, u = [], R = [],
        n = [[new THREE.Vector3(-1200, 1500, 1300), new THREE.Vector3(-950, 800, 950), new THREE.Vector3(-450, 400, 600), new THREE.Vector3(-100, 0, -800), new THREE.Vector3(2900, -1e3, 0), new THREE.Vector3(2e3, -300, 500), new THREE.Vector3(1500, 700, 1e3), new THREE.Vector3(600, 900, 1300), new THREE.Vector3(-100, 1200, 2600)], [new THREE.Vector3(-1e3, 700, 2600), new THREE.Vector3(-400, 200, 1200), new THREE.Vector3(500, 400, 700), new THREE.Vector3(1800, 1200, -400), new THREE.Vector3(1e3, 800, -900), new THREE.Vector3(800, -200, -1e3), new THREE.Vector3(-1600, -300, 700)], [new THREE.Vector3(1300, 1200, -2100), new THREE.Vector3(700, 1800, -1400), new THREE.Vector3(-1e3, 700, -1300), new THREE.Vector3(-1300, 900, -300), new THREE.Vector3(-1400, 1300, 800), new THREE.Vector3(-1600, -300, 900), new THREE.Vector3(-200, -500, 1200), new THREE.Vector3(1300, 300, 1700), new THREE.Vector3(1800, 1100, 700), new THREE.Vector3(400, 500, -500), new THREE.Vector3(1e3, 800, -1500)]];

    function C(e) {
        switch (f = e, log("@state", f), f) {
            case T.DEFAULT:
                break;
            case T.WALK_EGGS:
                CW.Util.forEach(u, function (e, o) {
                    e.visible = !0
                }), TweenLite.delayedCall(8, function () {
                    C(T.WALK_ROBOT)
                });
                break;
            case T.WALK_ROBOT:
                !function () {
                    robot.actWalk(), robot.headAndNeck.actShake();
                    TweenLite.to(s.position, 8, {z: 0, ease: Sine.easeOut}), TweenLite.to(robot.position, 8, {
                        z: 0,
                        ease: Sine.easeOut,
                        onComplete: function () {
                            robot.actStand(), C(T.SHOW_GHOSTS)
                        }
                    })
                }();
                break;
            case T.SHOW_GHOSTS:
                !function () {
                    robot.raiseHead(20, 2), robot.actShakeHeadSide(), c.changeCameraPosition(593, 1575, 4270, 3);
                    var t = 0, n = R.length;
                    CW.Util.forEach(R, function (e, o) {
                        e.show(function () {
                            n <= (t += 1) && TweenLite.delayedCall(4, function () {
                                C(T.WAIT_CLICK_FRIEND)
                            })
                        })
                    })
                }();
                break;
            case T.WAIT_CLICK_FRIEND:
                a = s.position.clone(), c.addIndicator(a);
                break;
            case T.RED_FRIEND:
                s.changeColorRed(), TweenLite.to(s.position, 1, {
                    y: 1e3, ease: Sine.easeInOut, onComplete: function () {
                        TweenLite.to(s.scale, .5, {x: 2, y: 2, z: 2, ease: Back.easeInOut}), C(T.CRUMPLE_GHOSTS)
                    }
                });
                break;
            case T.CRUMPLE_GHOSTS:
                n = 0, i = R.length, r = [new THREE.Vector3(-500, 700, 0), new THREE.Vector3(500, 700, 0), new THREE.Vector3(0, 700, 600)], CW.Util.forEach(R, function (e, o) {
                    TweenLite.delayedCall(2 * o, function () {
                        e.crumple(r[o], c, function () {
                            i <= (n += 1) && C(T.ORIGIN_FRIEND)
                        })
                    })
                });
                break;
            case T.ORIGIN_FRIEND:
                robot.actShakeHead(), robot.aheadHead(1), robot.turnFrontHead(1), s.changeColorOrigin(), TweenLite.to(s.scale, .4, {
                    x: 1,
                    y: 1,
                    z: 1,
                    ease: Power1.easeInOut
                }), TweenLite.to(s.position, 1, {y: 330, ease: Sine.easeInOut}), C(T.SINK_GHOSTS);
                break;
            case T.SINK_GHOSTS:
                o = 0, t = R.length, CW.Util.forEach(R, function (e) {
                    e.sink(c, function () {
                        t <= (o += 1) && (CW.Util.forEach(R, function (e) {
                            c.remove(e)
                        }), R = null, C(T.LEAVE))
                    })
                });
                break;
            case T.LEAVE:
                c.changeCameraPosition(-716, 4228, 4334, 2), robot.actWalk(), TweenLite.to(robot.position, 6, {
                    z: 2600,
                    ease: Sine.easeIn,
                    onComplete: function () {
                        C(T.END)
                    }
                }), TweenLite.to(s.position, 6, {z: 2600, ease: Sine.easeIn});
                break;
            case T.END:
                c.removeEventListener("click", H), c.removeEventListener("mousemove", h), c.removeEventListener("touchstart", S, !1), c.remove(E), robot.visible = !1, s.visible = !1, E = null, robot = null, s = null, setTimeout(function () {
                    l.dispatchEvent(l.finishEvent)
                }, 10)
        }
        var o, t, n, i, r, a
    }

    function H() {
        t()
    }

    function S(e) {
        t()
    }

    function t() {
        f === T.WAIT_CLICK_FRIEND && c.intersectObject(s.boundingBox) && (c.setCursor(!1), c.removeIndicator(), C(T.RED_FRIEND))
    }

    function h(e) {
        f === T.WAIT_CLICK_FRIEND && c.setCursor(c.intersectObject(s.boundingBox))
    }

    this.init = function () {
        var e;
        (e = new THREE.BoxBufferGeometry(1, 1, 1)).applyMatrix((new THREE.Matrix4).makeTranslation(0, -.5, 0)), (E = new THREE.Mesh(e, new THREE.MeshBasicMaterial({color: o}))).scale.set(5e3, 500, 5e3), E.position.y = -2, E.visible = !1, function () {
            for (var e, o = [-2400, -1900, -1500, -1e3, -400, 400, 800, 1200, 1700, 2100, 2500], t = 0; t < 10; t++) (e = new CW.Egg).position.x = CW.Util.randomFloor(200, 1500), Math.random() < .5 && (e.position.x *= -1), e.position.x = o[t], e.position.z = CW.Util.randomFloor(-4e3, -9e3), e.visible = !1, u.push(e), e.actWalk(), e.scale.set(3, 3, 3)
        }(), function () {
            for (var e = [{firstColor: "#ec2F4B", finalColor: "#009FFF"}, {
                firstColor: "#FF8235",
                finalColor: "#2ebf91"
            }], e = [{firstColor: "#756c83", finalColor: "#f38181"}, {
                firstColor: "#216583",
                finalColor: "#f9f8ed"
            }, {firstColor: "#FF8235", finalColor: "#2ebf91"}], o = 0; o < n.length; o++) {
                var t = new CW.Ghost(n[o], e[o].firstColor, e[o].finalColor);
                R.push(t)
            }
        }()
    }, this.start = function () {
        log("#SceneGhost start"), c.changeFogColor(o, 1), c.changeFogNear(5e3, 1), c.changeFogFar(8e3, 1), c.control.target.set(0, 0, 0), c.setCameraPosition(-716, 4228, 4334), c.changeBackColor(o, function () {
            c.dirLight.position.set(0, 2e3, 236), c.add(E), CW.Util.forEach(u, function (e) {
                c.add(e)
            }), CW.Util.forEach(R, function (e) {
                c.add(e)
            }), c.addEventListener("click", H), c.addEventListener("mousemove", h), c.addEventListener("touchstart", S, !1), c.plane.visible = !0, robot = c.getRobot(), robot.visible = !0, robot.position.set(0, 0, -3500), (s = c.getFriend()).visible = !0, s.position.set(-50, 330, -3500), E.visible = !0, setTimeout(function () {
                C(T.WALK_EGGS)
            }, 0)
        })
    }, this.update = function () {
        s && s.update(), function () {
            if (!u) return;
            for (var e, o = u.length - 1; 0 <= o; o--) (e = u[o]).update(), 3e3 < e.position.z && (u.splice(o, 1), c.remove(e), 0 === u.length && (u = null))
        }(), function () {
            if (!R) return;
            CW.Util.forEach(R, function (e) {
                e.update()
            })
        }()
    }
}, CW.SceneGhost.prototype = Object.create(CW.Scene.prototype), CW.SceneGhost.prototype.constructor = CW.SceneGhost;
CW.SceneGiant = function (n) {
    CW.Scene.call(this), this.name = "SceneGiant";
    var a, o, i, c, s, r = this, e = "#EECDA3", A = {
            DEFAULT: "DEFAULT",
            COME_GIANT: "COME_GIANT",
            SHOW_FLOOR: "SHOW_FLOOR",
            WALK_ROBOT: "WALK_ROBOT",
            WAIT_CLICK_GIANT: "WAIT_CLICK_GIANT",
            RAISE_GIANT_ARM: "RAISE_GIANT_ARM",
            SHOW_MAIN_ROAD: "SHOW_MAIN_ROAD",
            WALK_ALONG_MAIN_ROAD: "WALK_ALONG_MAIN_ROAD",
            HIDE: "HIDE",
            END: "END"
        }, _ = A.DEFAULT, l = [],
        t = [[0, 0, 0], [-100, -400, 1e3], [50, -0, 2e3], [0, 100, 3e3], [0, 800, 4e3], [0, 400, 6e3]];

    function d(e) {
        switch (_ = e, log("@state", _), _) {
            case A.DEFAULT:
                break;
            case A.COME_GIANT:
                a.come(function () {
                    d(A.SHOW_FLOOR)
                });
                break;
            case A.SHOW_FLOOR:
                o.visible = !0, TweenLite.to(o.scale, 1, {z: 5e3, ease: Power2.easeOut}), d(A.WALK_ROBOT);
                break;
            case A.WALK_ROBOT:
                a.setLookAtTarget(c), c.visible = !0, c.actWalk(), c.headAndNeck.actShake(), TweenLite.to(c.position, 7, {
                    z: 0,
                    ease: Sine.easeOut,
                    onComplete: function () {
                        c.actStand(), d(A.WAIT_CLICK_GIANT)
                    }
                }), TweenLite.delayedCall(4, function () {
                    c.raiseHead(25, 1), c.turnLeftHead(45, 1)
                });
                break;
            case A.WAIT_CLICK_GIANT:
                (t = a.position.clone()).y += 2e3, n.addIndicator(t);
                break;
            case A.RAISE_GIANT_ARM:
                a.raiseLeftArm(function () {
                    d(A.SHOW_MAIN_ROAD)
                });
                break;
            case A.SHOW_MAIN_ROAD:
                i.show(), c.aheadHead(1), c.turnFrontHead(1), TweenLite.delayedCall(1, function () {
                    d(A.WALK_ALONG_MAIN_ROAD)
                });
                break;
            case A.WALK_ALONG_MAIN_ROAD:
                c.actRun(), CW.Util.forEach(l, function (e, t) {
                    TweenLite.delayedCall(1 + .6 * t, function () {
                        e.show()
                    })
                });
                break;
            case A.HIDE:
                c.visible = !1, TweenLite.to(o.scale, 4, {
                    z: 1,
                    ease: Power2.easeOut
                }), i.hide(), CW.Util.forEach(l, function (e, t) {
                    e.hide()
                }), a.leave(function () {
                    d(A.END)
                });
                break;
            case A.END:
                n.control.target.set(0, 0, 0), n.removeEventListener("click", O), n.removeEventListener("mousemove", u), n.removeEventListener("touchstart", I, !1), n.remove(a), n.remove(o), n.remove(i), CW.Util.forEach(l, function (e) {
                    n.remove(e)
                }), l = i = o = a = null, c.visible = !1, s.visible = !1, c.remove(s), n.scene.add(s), c = null, setTimeout(function () {
                    r.dispatchEvent(r.finishEvent)
                }, 10)
        }
        var t
    }

    function O() {
        L()
    }

    function I(e) {
        L()
    }

    function L() {
        _ === A.WAIT_CLICK_GIANT && n.intersectObject(a.boundingBox) && (d(A.RAISE_GIANT_ARM), n.setCursor(!1), n.removeIndicator())
    }

    function u(e) {
        _ === A.WAIT_CLICK_GIANT && n.setCursor(n.intersectObject(a.boundingBox))
    }

    this.init = function () {
        var e;
        (a = new CW.Giant).rotation.y = -Math.PI / 2, a.position.x = 7e3, a.position.y = -3e3, (e = new THREE.BoxBufferGeometry(1, 1, 1)).applyMatrix((new THREE.Matrix4).makeTranslation(0, 0, .5)), (o = new THREE.Mesh(e, new THREE.MeshLambertMaterial({color: 6317168}))).scale.set(200, 40, 1), o.position.set(0, -20, -5e3), o.visible = !1, i = new CW.Road(t, "#606470", "#efefef", !0), CW.Util.forEach(E, function (e, t) {
            var n = new CW.Road(e, "#606470", "#ffd2a5");
            l.push(n)
        })
    }, this.start = function () {
        log("#SceneGiant start"), n.changeFogColor(e, 1), n.changeFogNear(1e3, 1), n.changeFogFar(1e4, 1), n.setCameraPosition(-2521, 1458, 6147), n.changeColorLogo("#585858"), n.changeBackColor(e, function () {
            n.control.target.set(936, 9, 1240), n.dirLight.intensity = .4, n.plane.visible = !1, (c = n.getRobot()).visible = !1, c.position.set(0, 0, -3500), (s = n.getFriend()).visible = !0, s.position.set(-50, 330, 0), n.scene.remove(s), c.add(s), n.add(a), n.add(o), n.add(i), CW.Util.forEach(l, function (e) {
                n.add(e)
            }), n.addEventListener("click", O), n.addEventListener("mousemove", u), n.addEventListener("touchstart", I, !1), d(A.COME_GIANT)
        })
    }, this.update = function () {
        a && a.update(), _ === A.WALK_ALONG_MAIN_ROAD && i.along(c) && d(A.HIDE)
    };
    var E = [[[0, 0, 0], [406, -251, 616], [783, -99, 1139], [586, -469, 2123], [776, -44, 2886], [515, -27, 3690], [53, 12, 4437], [97, 66, 5015], [90, 77, 5700], [185, 282, 6671]], [[0, 0, 0], [109, 372, 654], [169, 246, 1344], [492, 639, 2282], [883, 520, 3125], [813, 303, 4064], [951, 204, 4882], [551, 560, 5869], [799, 570, 6726], [940, 468, 7706]], [[0, 0, 0], [-291, 377, 999], [-449, 805, 1929], [-182, 1094, 2554], [45, 1140, 3412], [-314, 1142, 4041], [-207, 1312, 4737], [23, 1449, 5298], [264, 1255, 5976], [662, 1533, 6634]], [[0, 0, 0], [-54, 17, 893], [-516, 501, 1757], [-553, 252, 2325], [-703, 313, 2912], [-994, 338, 3633], [-1359, 135, 4474], [-1234, 359, 4998], [-1685, 560, 5874], [-1839, 683, 6649]], [[0, 0, 0], [-446, 376, 756], [-659, 509, 1735], [-1013, 735, 2345], [-977, 1079, 3266], [-1152, 1188, 4167], [-752, 1567, 4890], [-806, 1708, 5800], [-1229, 2058, 6386], [-814, 2367, 7323]], [[0, 0, 0], [-400, 271, 681], [-563, 525, 1215], [-521, 678, 1923], [-950, 953, 2608], [-1148, 1062, 3222], [-1596, 1225, 4006], [-1781, 1374, 4638], [-1340, 1675, 5441], [-1602, 1995, 6045]], [[0, 0, 0], [-386, -322, 843], [-635, -451, 1718], [-205, -632, 2605], [-399, -840, 3335], [-814, -1070, 3857], [-527, -1181, 4763], [-966, -1364, 5282], [-1278, -1511, 5826], [-1771, -1644, 6622]], [[0, 0, 0], [-277, 171, 986], [-12, -251, 1858], [220, 42, 2640], [0, -226, 3581], [-477, -687, 4454], [-287, -200, 5065], [-291, -130, 5940], [148, -224, 6801], [611, -613, 7498]], [[0, 0, 0], [-442, 383, 941], [-435, 558, 1442], [-344, 806, 2230], [11, 1203, 2926], [138, 1351, 3591], [558, 1086, 4181], [133, 772, 5111], [-57, 477, 5641], [182, -17, 6567]], [[0, 0, 0], [-185, -329, 757], [-291, -748, 1459], [-314, -658, 2187], [-480, -327, 2742], [-582, 22, 3358], [-278, -314, 4299], [-141, -101, 5196], [-512, -417, 6164], [-175, -569, 7094]], [[0, 0, 0], [106, 42, 874], [-365, 135, 1675], [-859, 384, 2629], [-700, -98, 3345], [-1044, 81, 4225], [-1435, -399, 5183], [-1452, -61, 5844], [-1380, -15, 6718], [-1388, -39, 7662]], [[0, 0, 0], [-258, -269, 677], [-736, -327, 1243], [-804, 3, 2217], [-487, -283, 2824], [-686, 195, 3363], [-558, 506, 3974], [-911, 865, 4605], [-496, 1016, 5495], [-186, 983, 6384]], [[0, 0, 0], [-475, 361, 750], [-104, 681, 1426], [-475, 1121, 2251], [-960, 1411, 2981], [-685, 1698, 3946], [-592, 1666, 4543], [-545, 1805, 5436], [-985, 1384, 6145], [-1197, 1107, 6845]], [[0, 0, 0], [-354, -43, 810], [-331, 401, 1448], [-285, -22, 2219], [69, -491, 2735], [226, -889, 3394], [608, -1349, 3960], [903, -1404, 4493], [731, -1008, 5143], [1042, -1030, 6128]], [[0, 0, 0], [-486, 470, 850], [-913, 226, 1511], [-1339, 373, 2018], [-1575, 522, 2586], [-1299, 559, 3169], [-1453, 865, 3983], [-1724, 1345, 4857], [-1405, 869, 5501], [-1720, 1358, 6340]]]
}, CW.SceneGiant.prototype = Object.create(CW.Scene.prototype), CW.SceneGiant.prototype.constructor = CW.SceneGiant;
CW.SceneHoles = function (a) {
    CW.Scene.call(this), this.name = "SceneHoles";
    var T, d, r = this, E = "#ed8d8d", c = {
            WAIT_FOR_CLOSE: "WAIT_FOR_CLOSE",
            DEFAULT: "DEFAULT",
            WAITING: "WAITING",
            SHOW_ENTRANCE: "SHOW_ENTRANCE",
            WAIT_CLICK_ENTRANCE: "WAIT_CLICK_ENTRANCE",
            SHOW_RIGHT_DOORS: "SHOW_RIGHT_DOORS",
            ENTER_ROBOT: "ENTER_ROBOT",
            WAIT_CLICK_RIGHTDOORS: "WAIT_CLICK_RIGHTDOORS",
            GO_OUT_FISH: "GO_OUT_FISH",
            SHOW_LEFT_DOORS: "SHOW_LEFT_DOORS",
            WAIT_CLICK_LEFTDOORS: "WAIT_CLICK_LEFTDOORS",
            GO_OUT_PILL: "GO_OUT_PILL",
            WAIT_CLICK_FRIEND: "WAIT_CLICK_FRIEND",
            LEAVE: "LEAVE",
            END: "END"
        }, l = c.WAIT_FOR_CLOSE, C = null, I = [], O = [], _ = [], f = [], p = [], L = [], W = [],
        e = new THREE.Vector3(0, 0, 3), o = new THREE.Vector3(0, 0, .07), i = 1, t = 5;

    function u() {
        -300 < robot.position.z && (o.z = -.015), e.add(o), e.z = CW.Util.constrain(e.z, i, t), robot.position.add(e), 0 <= robot.position.z && (R(c.WAIT_FOR_CLOSE), robot.position.z = 0, robot.actStand(), T.close(function () {
            T.visible = !1, R(c.SHOW_RIGHT_DOORS)
        }))
    }

    function h() {
        var e, i, t = 999999;
        CW.Util.forEach(L, function (e, o) {
            e.update(), t = Math.min(e.position.z, t)
        }), 2500 < t && (R(c.WAIT_FOR_CLOSE), CW.Util.forEach(L, function (e, o) {
            e.visible = !1
        }), e = function () {
            R(c.SHOW_LEFT_DOORS)
        }, i = 0, CW.Util.forEach(I, function (e, o) {
            i = .05 * o, TweenLite.delayedCall(.05 * o, function () {
                e.close()
            })
        }), i += 2, TweenLite.delayedCall(i, function () {
            e && e()
        }))
    }

    function b() {
        var e, i, t = 999999;
        CW.Util.forEach(W, function (e, o) {
            e.update(), t = Math.min(e.position.x - e.height, t)
        }), 3500 < t && (R(c.WAIT_FOR_CLOSE), CW.Util.forEach(W, function (e, o) {
            e.visible = !1
        }), e = function () {
            var e;
            e = function () {
                R(c.WAIT_CLICK_FRIEND)
            }, log("comeFriend"), d.visible = !0, d.position.z = 3e3, TweenLite.to(d.position, 7, {
                z: 400,
                ease: Sine.easeOut,
                onComplete: function () {
                    e && e()
                }
            }), TweenLite.to(robot.rotation, 2, {
                delay: 3,
                y: 0,
                ease: Sine.easeInOut
            }), TweenLite.delayedCall(3, function () {
                robot.aheadHead(1.5)
            })
        }, i = 0, CW.Util.forEach(_, function (e, o) {
            i = .05 * o, TweenLite.delayedCall(.1 * o, function () {
                e.close()
            })
        }), i += 2, TweenLite.delayedCall(i, function () {
            e && e()
        }))
    }

    function R(e) {
        switch (l = e, log("@state", l), C = null, l) {
            case c.DEFAULT:
            case c.WAIT_FOR_CLOSE:
                break;
            case c.SHOW_ENTRANCE:
                T.show(function () {
                    TweenLite.delayedCall(1, function () {
                        R(c.WAIT_CLICK_ENTRANCE)
                    })
                });
                break;
            case c.WAIT_CLICK_ENTRANCE:
                s = T.position.clone().add(new THREE.Vector3(0, 260, 0)), a.addIndicator(s);
                break;
            case c.ENTER_ROBOT:
                robot.visible = !0, robot.headAndNeck.actShake(), robot.actWalk(), C = u;
                break;
            case c.SHOW_RIGHT_DOORS:
                n = 1, CW.Util.forEach(I, function (e, o) {
                    n += .01 * o, TweenLite.delayedCall(n, function () {
                        e.show()
                    })
                }), TweenLite.delayedCall(n + 1.6, function () {
                    R(c.WAIT_CLICK_RIGHTDOORS)
                }), TweenLite.to(robot.rotation, 1.5, {
                    delay: 1.5,
                    y: -Math.PI,
                    ease: Sine.easeInOut
                }), TweenLite.delayedCall(2, function () {
                    robot.raiseHead(30, 1)
                });
                break;
            case c.WAIT_CLICK_RIGHTDOORS:
                (t = I[2].position.clone()).y += 400, a.addIndicator(t);
                break;
            case c.GO_OUT_FISH:
                CW.Util.forEach(L, function (e, o) {
                    e.visible = !0
                }), TweenLite.to(robot.rotation, 2, {
                    delay: 1.8,
                    y: 2 * -Math.PI,
                    ease: Sine.easeInOut,
                    onComplete: function () {
                        robot.rotation.y = 0
                    }
                }), C = h;
                break;
            case c.SHOW_LEFT_DOORS:
                !function (e) {
                    CW.Util.forEach(I, function (e) {
                        e.visible = !1
                    }), a.plane.position.z = 0, a.plane.position.x = 2e3;
                    var i = 1;
                    CW.Util.forEach(_, function (e, o) {
                        i += .01 * o, TweenLite.delayedCall(i, function () {
                            e.show()
                        })
                    }), TweenLite.delayedCall(i + 1.6, function () {
                        R(c.WAIT_CLICK_LEFTDOORS)
                    }), TweenLite.to(robot.rotation, 1.5, {delay: 1.5, y: -Math.PI / 2, ease: Sine.easeInOut})
                }();
                break;
            case c.WAIT_CLICK_LEFTDOORS:
                (i = p[3].position.clone()).y += 320, a.addIndicator(i);
                break;
            case c.GO_OUT_PILL:
                CW.Util.forEach(W, function (e, o) {
                    e.visible = !0
                }), TweenLite.to(robot.rotation, 2, {delay: 1.8, y: Math.PI / 2, ease: Sine.easeInOut}), C = b;
                break;
            case c.WAIT_CLICK_FRIEND:
                o = d.position.clone(), a.addIndicator(o);
                break;
            case c.LEAVE:
                TweenLite.to(d.rotation, 1, {y: 0}), TweenLite.to(d.position, 12, {
                    delay: .5,
                    z: 3e3,
                    ease: Sine.easeIn
                }), TweenLite.delayedCall(3, function () {
                    robot.actWalk(), robot.headAndNeck.actShake()
                }), TweenLite.to(robot.position, 10, {
                    delay: 3, z: 3e3, ease: Sine.easeIn, onComplete: function () {
                        R(c.END)
                    }
                });
                break;
            case c.END:
                a.control.target.set(0, 0, 0), a.removeEventListener("click", S), a.removeEventListener("mousemove", A), a.removeEventListener("touchstart", v), a.remove(T), CW.Util.forEach(I, function (e) {
                    a.remove(e)
                }), CW.Util.forEach(p, function (e) {
                    a.remove(e)
                }), CW.Util.forEach(L, function (e) {
                    a.remove(e)
                }), CW.Util.forEach(W, function (e) {
                    a.remove(e)
                }), a.remove(d), robot.visible = !1, d.visible = !1, L = f = _ = p = O = I = T = null, pill = null, d = null, robot = null, a.plane.position.set(0, 2, 0), a.plane.scale.set(1e4, 1, 1e4), setTimeout(function () {
                    r.dispatchEvent(r.finishEvent)
                }, 10)
        }
        var o, i, t, n, s
    }

    function S() {
        n()
    }

    function v(e) {
        n()
    }

    function n() {
        switch (l) {
            case c.WAIT_CLICK_ENTRANCE:
                if (!a.intersectObject(T.doorPlane)) return;
                R(c.WAIT_FOR_CLOSE), a.setCursor(!1), a.removeIndicator(), T.open(function () {
                    R(c.ENTER_ROBOT)
                });
                break;
            case c.WAIT_CLICK_RIGHTDOORS:
                if (!a.intersectObjects(O)) return;
                !function () {
                    R(c.WAIT_FOR_CLOSE);
                    var i = 0;
                    CW.Util.forEach(I, function (e, o) {
                        i += .005 * o, TweenLite.delayedCall(i, function () {
                            e.open()
                        })
                    }), a.setCursor(!1), a.removeIndicator(), TweenLite.delayedCall(1.8, function () {
                        R(c.GO_OUT_FISH)
                    })
                }();
                break;
            case c.WAIT_CLICK_LEFTDOORS:
                if (!a.intersectObjects(f)) return;
                i = 0, CW.Util.forEach(_, function (e, o) {
                    i += .005 * o, TweenLite.delayedCall(i, function () {
                        e.open()
                    })
                }), a.setCursor(!1), a.removeIndicator(), TweenLite.delayedCall(1.2, function () {
                    R(c.GO_OUT_PILL)
                });
                break;
            case c.WAIT_CLICK_FRIEND:
                if (!a.intersectObject(d.boundingBox)) return;
                a.setCursor(!1), a.removeIndicator(), R(c.LEAVE)
        }
        var i
    }

    function A() {
        switch (l) {
            case c.WAIT_CLICK_ENTRANCE:
                return void a.setCursor(a.intersectObject(T.doorPlane));
            case c.WAIT_CLICK_RIGHTDOORS:
                return void a.setCursor(a.intersectObjects(O));
            case c.WAIT_CLICK_LEFTDOORS:
                return void a.setCursor(a.intersectObjects(f));
            case c.WAIT_CLICK_FRIEND:
                return void a.setCursor(a.intersectObject(d.boundingBox))
        }
        a.setCursor(!1)
    }

    this.init = function () {
        var e, o, i, t, n, s, a, r, c, l, C, u;
        e = [{size: [100, 1500, 100], position: [400, 200, -500]}, {
            size: [300, 1500, 300],
            position: [800, 200, -500]
        }, {size: [400, 1500, 800], position: [500, 1e3, -500]}, {
            size: [350, 1500, 150],
            position: [300, 500, -500]
        }, {size: [240, 1500, 150], position: [1200, 600, -500]}, {
            size: [150, 1500, 250],
            position: [-300, 300, -500]
        }, {size: [400, 1500, 300], position: [-100, 900, -500]}, {
            size: [800, 1500, 400],
            position: [-900, 600, -500]
        }, {size: [400, 1500, 300], position: [-800, 200, -500]}, {
            size: [800, 1500, 500],
            position: [1300, 900, -500]
        }, {size: [900, 1500, 400], position: [-500, 1350, -500]}, {
            size: [500, 1500, 700],
            position: [-1700, 0, -500]
        }, {size: [200, 1500, 300], position: [-1550, 1100, -500]}, {
            size: [700, 1500, 400],
            position: [1500, 100, -500]
        }], o = [{size: [100, 4e3, 100], position: [-700, 200, 300]}, {
            size: [150, 4e3, 300],
            position: [-700, 400, -300]
        }, {size: [300, 1600, 800], position: [-700, 1300, -300]}, {
            size: [500, 8e3, 500],
            position: [-700, 600, 200]
        }, {size: [600, 4e3, 300], position: [-700, 1200, 400]}, {
            size: [500, 3500, 700],
            position: [-700, 800, -900]
        }, {size: [400, 3500, 550], position: [-700, 250, 900]}, {
            size: [600, 5500, 250],
            position: [-700, 150, -1200]
        }, {size: [500, 3500, 500], position: [-700, 600, -1650]}, {
            size: [400, 6e3, 400],
            position: [-700, 1700, 400]
        }, {size: [800, 6e3, 200], position: [-700, 1400, 1300]}, {
            size: [300, 6e3, 200],
            position: [-700, 10, -2100]
        }, {
            size: [300, 6e3, 800],
            position: [-700, 400, 1400]
        }], (T = new CW.HoleBox(250, 1e3, 400, E, "#393232", "#4d4545", "right")).init("right"), T.position.set(0, 0, -500), T.rotation.x = Math.PI / 2, T.visible = !1, c = e, CW.Util.forEach(c, function (e, o) {
            l = e.size, C = e.position, (u = new CW.HoleBox(l[0], l[1], l[2], E, "#393232", "#4d4545", "right")).init("right"), u.position.set(C[0], C[1], C[2]), u.rotation.x = Math.PI / 2, u.visible = !1, I.push(u), O.push(u.doorPlane)
        }), r = e, CW.Util.forEach(r, function (e, o) {
            var i = e.position[0], t = e.position[1] + e.size[2] / 2, n = e.position[2] - e.size[1] / 2,
                s = Math.min(e.size[0], e.size[2]) / 2 - 20, a = new CW.Fish(i, t, n, s);
            a.visible = !1, L.push(a)
        }), t = o, CW.Util.forEach(t, function (e, o) {
            n = e.size, s = e.position, (a = new CW.HoleBox(n[0], n[1], n[2], E, "#393232", "#4d4545", "left")).init("left"), a.innerGroup.rotation.x = Math.PI / 2, a.rotation.y = Math.PI / 2, a.visible = !1;
            var i = new THREE.Group;
            i.position.set(s[0], s[1], s[2]), i.add(a), p.push(i), _.push(a), f.push(a.doorPlane)
        }), i = o, CW.Util.forEach(i, function (e, o) {
            var i = e.position[0] - 700, t = e.position[1] + e.size[2] / 2, n = e.position[2],
                s = Math.min(e.size[0], e.size[2]) / 2 - 20, a = e.size[1] - 700, r = new CW.Pill(i, t, n, s, a);
            r.visible = !1, W.push(r)
        }), (d = new CW.Fish(0, 300, 3e3, 50)).velocity.set(0, 0, 0), d.acceleration.set(0, 0, 0), d.cycleAddValue = .09, d.rotation.y = Math.PI, d.visible = !1
    }, this.start = function () {
        log("#SceneHoles start"), a.changeFogColor(E, 1), a.changeFogNear(5e3, 1), a.changeFogFar(8e3, 1), a.camera.position.set(3295, 3110, 3166), a.setCameraPosition(3295, 3110, 3166), a.control.target.set(-919, -8, -1073), a.changeBackColor(E, function () {
            a.dirLight.position.set(1338, 2882, 800), a.plane.visible = !0, a.plane.scale.set(5e3, 1, 5e3), a.plane.position.z = 2e3, robot = a.getRobot(), robot.visible = !1, robot.position.z = -800, a.addEventListener("click", S), a.addEventListener("mousemove", A), a.addEventListener("touchstart", v, !1), a.add(T), CW.Util.forEach(I, function (e) {
                a.add(e)
            }), CW.Util.forEach(p, function (e) {
                a.add(e)
            }), CW.Util.forEach(L, function (e) {
                a.add(e)
            }), CW.Util.forEach(W, function (e) {
                a.add(e)
            }), a.add(d), setTimeout(function () {
                R(c.SHOW_ENTRANCE)
            }, 400)
        })
    }, this.update = function () {
        C && C(), d && d.visible && d.update()
    }
}, CW.SceneHoles.prototype = Object.create(CW.Scene.prototype), CW.SceneHoles.prototype.constructor = CW.SceneHoles;
CW.SceneHome = function (o) {
    CW.Scene.call(this), this.name = "SceneHome";
    var t, O, n, i, a, _, c = this, r = {
        DEFAULT: "DEFAULT",
        WALK_ROBOT_TO_CENTER: "WALK_ROBOT_TO_CENTER",
        MOVE_FLOOR_TO_CENTER: "MOVE_FLOOR_TO_CENTER",
        STAND_ROBOT: "STAND_ROBOT",
        OPEN_SHADOW_DOOR: "OPEN_SHADOW_DOOR",
        WAIT_CLICK_DOOR: "WAIT_CLICK_DOOR",
        OPEN_DOOR: "OPEN_DOOR",
        WAIT_CLICK_DOOR_TO_ENTER: "WAIT_CLICK_DOOR_TO_ENTER",
        ENTER_A_LITTLE: "ENTER_A_LITTLE",
        SAY_GOODBYE: "SAY_GOODBYE",
        ENTER: "ENTER",
        CLOSE_DOOR: "CLOSE_DOOR",
        HIDE_DOOR: "HIDE_DOOR",
        CLOSE_SHADOW_DOOR: "CLOSE_SHADOW_DOOR",
        HIDE_SHADOW_DOOR: "HIDE_SHADOW_DOOR",
        SHOW_ROBOT_AND_SHADOW_DOOR: "SHOW_ROBOT_AND_SHADOW_DOOR",
        FINALLY_SAY_GOODBYE: "REALLY_SAY_GOODBYE",
        FINALLY_CLOSE_SHADOW_DOOR: "FINALLY_CLOSE_SHADOW_DOOR",
        FINALLY_HIDE_SHADOW_DOOR: "FINALLY_HIDE_SHADOW_DOOR",
        END: "END"
    }, s = r.DEFAULT, e = 24, E = 7, D = [];

    function T(e) {
        switch (s = e, log("@state", s), s) {
            case r.DEFAULT:
                break;
            case r.WALK_ROBOT_TO_CENTER:
                TweenLite.to(a.position, 6, {z: 100, ease: Sine.easeInOut}), TweenLite.delayedCall(6, function () {
                    T(r.MOVE_FLOOR_TO_CENTER)
                });
                break;
            case r.MOVE_FLOOR_TO_CENTER:
                TweenLite.to(o.plane.material, 9, {opacity: .45});
                break;
            case r.STAND_ROBOT:
                o.setBackColor("#ffffff"), a.actStand(), TweenLite.delayedCall(.5, function () {
                    T(r.OPEN_SHADOW_DOOR)
                });
                break;
            case r.OPEN_SHADOW_DOOR:
                i.openDoor(function () {
                    T(r.WAIT_CLICK_DOOR)
                });
                break;
            case r.WAIT_CLICK_DOOR:
                o.addIndicator(new THREE.Vector3(0, 330, -800));
                break;
            case r.OPEN_DOOR:
                n.door.open(function () {
                    T(r.WAIT_CLICK_DOOR_TO_ENTER)
                });
                break;
            case r.WAIT_CLICK_DOOR_TO_ENTER:
                o.addIndicator(new THREE.Vector3(0, 330, -800), void 0, "black");
                break;
            case r.ENTER_A_LITTLE:
                a.actWalk(), TweenLite.to(a.position, 3, {
                    z: -500, ease: Power1.easeInOut, onComplete: function () {
                        T(r.SAY_GOODBYE)
                    }
                });
                break;
            case r.SAY_GOODBYE:
                a.actStand(), TweenLite.delayedCall(.5, function () {
                    a.actSayGoodBye(o.camera.position, function () {
                        T(r.ENTER)
                    })
                });
                break;
            case r.ENTER:
                CW.Util.forEach(D, function (e, o) {
                    e.isUpdate = !1, TweenLite.to(e.position, 1, {
                        y: CW.Util.randomFloor(-500, -100),
                        ease: Power1.easeInOut
                    })
                }), TweenLite.delayedCall(1.2, function () {
                    for (var e = D.length - 1; 0 <= e; e--) o.remove(D[e]);
                    D = null
                }), TweenLite.to(a.position, 4, {
                    z: -960, ease: Sine.easeInOut, onComplete: function () {
                        T(r.CLOSE_DOOR)
                    }
                });
                break;
            case r.CLOSE_DOOR:
                n.door.close(function () {
                    T(r.HIDE_DOOR)
                });
                break;
            case r.HIDE_DOOR:
                a.visible = !1, n.cover.rotation.x = -Math.PI / 2, n.cover.position.y = -30, O.visible = !1, TweenLite.to(n.door.rotation, 3, {
                    x: -Math.PI / 2,
                    ease: Power2.easeIn,
                    onComplete: function () {
                        T(r.CLOSE_SHADOW_DOOR)
                    }
                }), TweenLite.to(n.door.position, 5, {
                    delay: 2, y: -100, ease: Sine.easeInOut, onComplete: function () {
                        n.door.visible = !1, n.cover.visible = !1
                    }
                });
                break;
            case r.CLOSE_SHADOW_DOOR:
                i.closeDoor(function () {
                    T(r.HIDE_SHADOW_DOOR)
                });
                break;
            case r.HIDE_SHADOW_DOOR:
                TweenLite.to(o.plane.material, 1, {opacity: 0}), TweenLite.delayedCall(4, function () {
                    T(r.SHOW_ROBOT_AND_SHADOW_DOOR)
                });
                break;
            case r.SHOW_ROBOT_AND_SHADOW_DOOR:
                a.scale.set(1.5, 1.5, 1.5), a.position.set(0, 3500, 140), a.rotation.x = -Math.PI / 2, a.visible = !0, _.scale.set(1.5, 1.5, 1.5), _.position.set(-50, 3500, -320), _.rotation.x = Math.PI / 2, _.visible = !0, TweenLite.to(o.plane.material, 1, {
                    opacity: .3,
                    onComplete: function () {
                    }
                }), TweenLite.delayedCall(.5, function () {
                    i.openDoor(function () {
                        T(r.FINALLY_SAY_GOODBYE)
                    })
                });
                break;
            case r.FINALLY_SAY_GOODBYE:
                a.rightArm.actShake(function () {
                    T(r.FINALLY_CLOSE_SHADOW_DOOR)
                });
                break;
            case r.FINALLY_CLOSE_SHADOW_DOOR:
                i.closeDoor(function () {
                    T(r.FINALLY_HIDE_SHADOW_DOOR)
                });
                break;
            case r.FINALLY_HIDE_SHADOW_DOOR:
                TweenLite.to(o.plane.material, 1, {
                    opacity: 0, onComplete: function () {
                        T(r.END)
                    }
                });
                break;
            case r.END:
                o.removeEventListener("click", L), o.removeEventListener("mousemove", A), o.removeEventListener("touchstart", R, !1), o.remove(t), o.remove(_), a.visible = !1, _.visible = !1, i.visible = !1, t = O = i = n = null, setTimeout(function () {
                    c.dispatchEvent(c.finishEvent)
                }, 10)
        }
    }

    function L() {
        C()
    }

    function R(e) {
        C()
    }

    function C() {
        s === r.WAIT_CLICK_DOOR ? o.intersectObject(n.door.boundingBox) && (o.setCursor(!1), o.removeIndicator(), T(r.OPEN_DOOR)) : s === r.WAIT_CLICK_DOOR_TO_ENTER && o.intersectObject(n.door.boundingBox) && (o.setCursor(!1), o.removeIndicator(), T(r.ENTER_A_LITTLE))
    }

    function A(e) {
        s === r.WAIT_CLICK_DOOR ? o.setCursor(o.intersectObject(n.door.boundingBox)) : s === r.WAIT_CLICK_DOOR_TO_ENTER && o.setCursor(o.intersectObject(n.door.boundingBox))
    }

    this.init = function () {
        (t = new THREE.Group).position.z = -12e3, (n = new CW.House).position.z = -800, (i = new CW.HouseFakeShadow).position.set(0, 3400, 142), i.rotation.x = -Math.PI / 2, O = new CW.HomeFloor, function () {
            for (var e = 0; e < 100; e++) {
                var o = new CW.HomeDust;
                D.push(o)
            }
        }()
    }, this.start = function () {
        log("#SceneHome start"), o.changeFogColor("#ffffff", 2), o.changeFogNear(2e4, 2), o.changeFogFar(3e4, 2), o.setCameraPosition(-1986, 2918, 3621), o.changeBackColor("#EECDA3", function () {
            o.dirLight.position.set(0, 4e3, 300), o.dirLight.shadow.camera.left = -5e3, o.dirLight.shadow.camera.right = 5e3, o.dirLight.shadow.camera.top = 5e3, o.dirLight.shadow.camera.bottom = -5e3, o.plane.material.opacity = .2, (a = o.getRobot()).visible = !0, a.rotation.y = -Math.PI, a.actRun(), a.headAndNeck.actShake(), a.position.set(0, 0, 3e3), (_ = o.getFriend()).visible = !1, _.position.set(-50, 330, 3e3), o.add(t), t.add(n), t.add(i), t.add(O), CW.Util.forEach(D, function (e) {
                o.add(e)
            }), o.addEventListener("click", L), o.addEventListener("mousemove", A), o.addEventListener("touchstart", R, !1), setTimeout(function () {
                T(r.WALK_ROBOT_TO_CENTER)
            }, 1)
        })
    }, this.update = function () {
        !function () {
            if (!D) return;
            CW.Util.forEach(D, function (e, o) {
                e.update()
            })
        }(), function () {
            if (s !== r.MOVE_FLOOR_TO_CENTER) return;
            -1500 < t.position.z && (e -= .2) < E && (e = E);
            t.position.z += e, 0 < t.position.z && (t.position.z = 0, T(r.STAND_ROBOT))
        }()
    }
}, CW.SceneHome.prototype = Object.create(CW.Scene.prototype), CW.SceneHome.prototype.constructor = CW.SceneHome;
CW.SceneManager = function (e) {
    var n, t = -1, i = null, u = [], s = 0, c = new CW.TextManager(e);

    function o() {
        if (t >= u.length - 1) return log("모든 장면 끝"), TweenLite.set("#introduce", {
            display: "block",
            y: 10
        }), void TweenLite.to("#introduce", 2, {delay: .1, y: 0, opacity: 1, ease: Sine.easeInOut});
        (i = u[t += 1]).start(), c.next(t)
    }

    function a(e) {
        log("finishScene", e), o()
    }

    this.load = function (e) {
        n = e, function e() {
            if (s >= u.length) return void n();
            u[s].init();
            s += 1;
            setTimeout(function () {
                e()
            }, 1)
        }()
    }, this.start = function (e) {
        t = e ? function (e) {
            for (var n = 0, t = u.length; n < t; n++) if (e === u[n].name) return n;
            return 0
        }(e) : 0, (i = u[t]).start(), c.start(t)
    }, this.length = function () {
        return u.length
    }, this.update = function () {
        i && i.update()
    }, u.push(new CW.SceneTitle(e)), u.push(new CW.SceneConstructRobot(e)), u.push(new CW.SceneBridge(e)), u.push(new CW.SceneRainyDay(e)), u.push(new CW.SceneEat(e)), u.push(new CW.SceneFloatingIsland(e)), u.push(new CW.SceneSky(e)), u.push(new CW.ScenePlanet(e)), u.push(new CW.SceneHoles(e)), u.push(new CW.SceneGhost(e)), u.push(new CW.SceneSea(e)), u.push(new CW.SceneGiant(e)), u.push(new CW.SceneWall(e)), u.push(new CW.SceneHome(e)), CW.Util.forEach(u, function (e, n) {
        e.addEventListener("finish", a)
    })
};
CW.ScenePlanet = function (a) {
    CW.Scene.call(this), this.name = "ScenePlanet";
    var t, i, c = this, e = "#6c5b7b", r = {
        DEFAULT: "DEFAULT",
        SHOW_PLANET: "SHOW_PLANET",
        SHOW_RINGS: "SHOW_RINGS",
        WAIT_CLICK_PLANET: "WAIT_CLICK_PLANET",
        HIDE_RINGS: "HIDE_RINGS",
        HIDE_PLANET: "HIDE_PLANET",
        END: "END"
    }, s = r.DEFAULT, u = [];

    function E(e) {
        switch (s = e) {
            case r.DEFAULT:
                break;
            case r.SHOW_PLANET:
                t.rotation.x = Math.PI, TweenLite.to(t.rotation, 2, {
                    x: 0,
                    ease: Back.easeOut
                }), TweenLite.to(t.position, 2, {y: 0, ease: Back.easeOut}), TweenLite.delayedCall(1, function () {
                    E(r.SHOW_RINGS)
                });
                break;
            case r.SHOW_RINGS:
                n = u.length, o = 0, CW.Util.forEach(u, function (e, t) {
                    TweenLite.delayedCall(.1 * t, function () {
                        e.show(function () {
                            n <= (o += 1) && E(r.WAIT_CLICK_PLANET)
                        })
                    })
                });
                break;
            case r.WAIT_CLICK_PLANET:
                a.addIndicator(i);
                break;
            case r.HIDE_RINGS:
                CW.Util.forEach(u, function (e, t) {
                    TweenLite.delayedCall(.05 * t, function () {
                        e.hide()
                    })
                }), TweenLite.delayedCall(2, function () {
                    E(r.HIDE_PLANET)
                });
                break;
            case r.HIDE_PLANET:
                TweenLite.to(t.rotation, 3, {
                    x: -Math.PI / 2,
                    ease: Sine.easeInOut
                }), TweenLite.to(t.position, 3, {
                    y: -4e3, ease: Back.easeInOut, onComplete: function () {
                        E(r.END)
                    }
                });
                break;
            case r.END:
                a.removeEventListener("click", l), a.removeEventListener("mousemove", L), a.removeEventListener("touchstart", d, !1), t.remove(i), t.remove(robot), a.add(robot), a.remove(t), CW.Util.forEach(u, function (e, t) {
                    a.remove(e)
                }), t = u = i = null, robot.visible = !1, robot = null, setTimeout(function () {
                    c.dispatchEvent(c.finishEvent)
                }, 10)
        }
        var n, o
    }

    function l() {
        n()
    }

    function d(e) {
        n()
    }

    function n() {
        s === r.WAIT_CLICK_PLANET && a.intersectObject(i.boundingBox) && (a.setCursor(!1), a.removeIndicator(), E(r.HIDE_RINGS))
    }

    function L(e) {
        s === r.WAIT_CLICK_PLANET && a.setCursor(a.intersectObject(i.boundingBox))
    }

    this.init = function () {
        (t = new THREE.Group).position.y = -4e3, function () {
            for (var e, t = 1500, n = 0; n < 40; n++) (e = new CW.Ring(t)).position.y = -500, u.push(e), t = e.distance + e.radius + 30
        }(), (i = new CW.Planet(1e3)).position.y = -500, i.scale.set(.5, .5, .5)
    }, this.start = function () {
        log("#ScenePlanet start"), a.changeFogColor(e, 2), a.changeFogNear(11e3, 2), a.changeFogFar(17e3, 2), a.setCameraPosition(5863, -3997, 7174), a.changeBackColor(e, function () {
            a.plane.visible = !1, a.add(t), t.add(i), CW.Util.forEach(u, function (e) {
                a.add(e)
            }), robot = a.getRobot(), robot.position.set(0, 0, 0), robot.visible = !0, robot.headAndNeck.actShake(), robot.actRun(), a.remove(robot), t.add(robot), a.addEventListener("click", l), a.addEventListener("mousemove", L), a.addEventListener("touchstart", d, !1), TweenLite.delayedCall(.5, function () {
                E(r.SHOW_PLANET)
            })
        })
    }, this.update = function () {
        s !== r.END && (i && i.update(), CW.Util.forEach(u, function (e, t) {
            e.update()
        }))
    }
}, CW.ScenePlanet.prototype = Object.create(CW.Scene.prototype), CW.ScenePlanet.prototype.constructor = CW.ScenePlanet;
CW.SceneRainyDay = function (o) {
    CW.Scene.call(this), this.name = "SceneRainyDay";
    var a, n, i, r = this, s = CW.SceneRainyDay.sceneColor, c = {
        DEFAULT: "DEFAULT",
        WALK: "WALK",
        STAND: "STAND",
        WAVE: "WAVE",
        RAIN: "RAIN",
        WAIT_CLICK_RAINYFLOOR: "WAIT_CLICK_RAINYFLOOR",
        STOP_RAIN: "STOP_RAIN",
        FALL_FLOORS: "FALL_FLOORS",
        END: "END"
    }, l = c.DEFAULT, e = new THREE.Vector3(0, 0, 3), t = new THREE.Vector3(0, 0, .04), d = 1, C = 10, u = [];

    function R(e) {
        switch (l = e, log("@state", l), l) {
            case c.DEFAULT:
                break;
            case c.WALK:
                i.visible = !0, i.actRun();
                break;
            case c.STAND:
                i.actStand(), setTimeout(function () {
                    R(c.WAVE)
                }, 0);
                break;
            case c.WAVE:
                !function () {
                    o.plane.visible = !1, n.show();
                    var e = -130, t = new TimelineLite;
                    t.to(i.position, .6, {delay: .06, y: e, ease: Back.easeInOut}), t.to(i.position, .4, {
                        y: 143,
                        ease: Power3.easeOut
                    }), t.to(i.position, .9, {y: -13, ease: Power1.easeInOut}, "-=0.05"), t.to(i.position, .5, {
                        y: 4,
                        ease: Power2.easeOut
                    }, "-=0.05"), t.to(i.position, .2, {
                        y: 0, ease: Power2.easeOut, onComplete: function () {
                            R(c.RAIN)
                        }
                    }, "-=0.05");
                    (new TimelineLite).to(i.rotation, .6, {
                        delay: .06,
                        x: CW.Util.degToRad(15),
                        ease: Power1.easeInOut
                    }).to(i.rotation, .4, {
                        x: CW.Util.degToRad(-8),
                        ease: Power3.easeOut
                    }).to(i.rotation, .4, {
                        x: CW.Util.degToRad(4),
                        ease: Power1.easeInOut
                    }, "-=0.05").to(i.rotation, .4, {
                        x: CW.Util.degToRad(-3),
                        ease: Power1.easeInOut
                    }, "-=0.05").to(i.rotation, .5, {x: 0, ease: Power1.easeOut}, "-=0.05");
                    i.rightArm.actTop(1), i.leftArm.actTop(1), i.lowerHead(30, .6), TweenLite.delayedCall(.6, function () {
                        i.raiseHead(30, .5)
                    }), TweenLite.delayedCall(1.1, function () {
                        i.aheadHead(.5)
                    })
                }();
                break;
            case c.RAIN:
                o.changeFogColor("#d11a6d", 1.5), a.start(), n.startRain(), i.raiseHead(60, 2), i.rightArm.actBottom(3), i.leftArm.actBottom(3), TweenLite.delayedCall(3, function () {
                    R(c.WAIT_CLICK_RAINYFLOOR)
                });
                break;
            case c.WAIT_CLICK_RAINYFLOOR:
                o.addIndicator(n.position, new THREE.Vector3(200, 0, 300));
                break;
            case c.STOP_RAIN:
                a.stop(), n.stop(), o.changeFogColor(s, 1), TweenLite.delayedCall(1.5, function () {
                    R(c.FALL_FLOORS)
                });
                break;
            case c.FALL_FLOORS:
                n.visible = !1, o.plane.visible = !0, (t = new THREE.Mesh(new THREE.BoxGeometry(1200, 600, 1200), new THREE.MeshPhongMaterial({
                    color: CW.RainyFloor.finalColor,
                    flatShading: !0
                }))).position.y = -300, t.name = "SceneEatFloor", o.add(t), CW.Util.forEach(u, function (e, t) {
                    var o = e.geometry.faces, a = CW.Util.random(0, 1), n = CW.Util.random(2, 4),
                        i = CW.Util.random(-3e4, -16e3);
                    TweenLite.delayedCall(a, function () {
                        CW.Util.forEach(o, function (e, t) {
                            4 !== t && 5 !== t && (e.materialIndex = 0)
                        }), e.geometry.elementsNeedUpdate = !0, e.geometry.verticesNeedUpdate = !0
                    }), e.visible = !0, TweenLite.to(e.position, n, {delay: a, y: i, ease: Power2.easeInOut})
                }), o.setBackColor(CW.SceneEat.sceneColor), o.changeFogColor(CW.SceneEat.sceneColor, .4), o.changeFogNear(4300, .4), o.changeFogFar(7e3, .4), o.changeCameraPosition(2377, 2901, 4671, 1.5), n.showFloorBox(), i.lowerHead(20, 1), TweenLite.delayedCall(2, function () {
                    R(c.END)
                }), TweenLite.delayedCall(5, function () {
                    CW.Util.forEach(u, function (e) {
                        o.remove(e)
                    }), u = null
                });
                break;
            case c.END:
                o.removeEventListener("click", E), o.removeEventListener("mousemove", y), o.removeEventListener("touchstart", L, !1), o.remove(a), o.remove(n), n = a = null, setTimeout(function () {
                    r.dispatchEvent(r.finishEvent)
                }, 10)
        }
        var t
    }

    function E() {
        T()
    }

    function L(e) {
        T()
    }

    function T() {
        l === c.WAIT_CLICK_RAINYFLOOR && o.intersectObject(n.plane) && (o.setCursor(!1), o.removeIndicator(), R(c.STOP_RAIN))
    }

    function y(e) {
        l === c.WAIT_CLICK_RAINYFLOOR && o.setCursor(o.intersectObject(n.plane))
    }

    this.init = function () {
        n = new CW.RainyFloor(1200, 1200), (a = new CW.Rain(1200, 1200)).setFloor(n), function () {
            for (var e = [new THREE.MeshLambertMaterial({color: 15724527}), new THREE.MeshBasicMaterial({color: s})], t = 0; t < 14; t++) for (var o = 0; o < 16; o++) {
                var a = new THREE.BoxGeometry(500, 1e4, 500);
                a.applyMatrix((new THREE.Matrix4).makeTranslation(0, -5e3, 0)), CW.Util.forEach(a.faces, function (e, t) {
                    e.materialIndex = 2, 4 !== t && 5 !== t || (e.materialIndex = 1)
                });
                var n = new THREE.Mesh(a, e);
                n.position.y = -2, n.position.x = 500 * o - 4e3, n.position.z = 500 * t - 4400, n.visible = !1, u.push(n)
            }
        }()
    }, this.start = function () {
        log("#SceneRainyDay start"), o.setCameraPosition(1604, 2788, 1967), o.plane.visible = !0, o.changeFogColor(s, 2), o.changeFogNear(3e3, 2), o.changeFogFar(5e3, 2), (i = o.getRobot()).position.set(0, 0, -2800), o.changeBackColor(s), o.add(a), o.add(n), CW.Util.forEach(u, function (e) {
            o.add(e)
        }), o.addEventListener("click", E), o.addEventListener("mousemove", y), o.addEventListener("touchstart", L, !1), R(c.WALK)
    }, this.update = function () {
        n && n.update(i), a && a.update(), l === c.WALK && function () {
            -300 < i.position.z && (t.z = -.015);
            e.add(t), e.z = CW.Util.constrain(e.z, d, C), i.position.add(e), 0 <= i.position.z && (i.position.z = 0, R(c.STAND))
        }()
    }
}, CW.SceneRainyDay.prototype = Object.create(CW.Scene.prototype), CW.SceneRainyDay.prototype.constructor = CW.SceneRainyDay, CW.SceneRainyDay.sceneColor = "#31242a";
CW.SceneSea = function (t) {
    CW.Scene.call(this), this.name = "SceneSea";
    var n, o, i, a, s = this, c = "#606470", r = {
            DEFAULT: "DEFAULT",
            WAIT_FOR_CLOSE: "WAIT_FOR_CLOSE",
            WALK_ROBOT: "WALK_ROBOT",
            FLOAT_SEA: "FLOAT_SEA",
            WAIT_CLICK_SEA: "WAIT_CLICK_SEA",
            SINK_SEA: "SINK_SEA",
            LEAVE: "LEAVE",
            END: "END"
        }, E = r.DEFAULT, T = 0, e = 5,
        S = [new THREE.Vector3(-700, 100, -300), new THREE.Vector3(-100, 100, -600), new THREE.Vector3(700, 100, -50), new THREE.Vector3(600, 100, 700), new THREE.Vector3(-600, 100, 600)];

    function L(e) {
        switch (E = e, log("@SWITCH STATE:", E), E) {
            case r.DEFAULT:
                break;
            case r.WALK_ROBOT:
                a.actShakeHead(), a.actRun(), TweenLite.to(i.position, 5, {
                    z: 0,
                    ease: Sine.easeIn
                }), TweenLite.to(a.position, 5, {
                    z: 0, ease: Sine.easeIn, onComplete: function () {
                        a.actStand()
                    }
                }), TweenLite.delayedCall(4.5, function () {
                    L(r.FLOAT_SEA)
                });
                break;
            case r.FLOAT_SEA:
                a.raiseHead(20, 2), a.actShakeHeadSide(), n.visible = !0, TweenLite.to(n.position, .4, {
                    y: -400,
                    ease: Back.easeInOut
                }), TweenLite.to(n.position, 1, {
                    delay: 1, y: -20, ease: Circ.easeInOut, onComplete: function () {
                        t.addIndicator(S[T]), L(r.WAIT_CLICK_SEA)
                    }
                });
                break;
            case r.WAIT_CLICK_SEA:
                break;
            case r.SINK_SEA:
                TweenLite.to(n.position, .4, {
                    y: -700, ease: Back.easeInOut, onComplete: function () {
                        t.setCursor(!1), t.remove(n), n = null, L(r.LEAVE)
                    }
                });
                break;
            case r.LEAVE:
                a.actShakeHead(), a.aheadHead(1), a.turnFrontHead(1), a.actWalk(), TweenLite.to(i.position, 8, {
                    z: 3300,
                    ease: Sine.easeIn
                }), TweenLite.to(a.position, 8, {
                    z: 3300, ease: Sine.easeIn, onComplete: function () {
                        L(r.END)
                    }
                });
                break;
            case r.END:
                t.removeEventListener("click", u), t.removeEventListener("mousemove", d), t.removeEventListener("touchstart", A, !1), t.remove(n), t.remove(o), o = n = null, a.visible = !1, i.visible = !1, i = a = null, setTimeout(function () {
                    s.dispatchEvent(s.finishEvent)
                }, 10)
        }
    }

    function u() {
        l()
    }

    function A(e) {
        l()
    }

    function l() {
        E === r.WAIT_CLICK_SEA && t.intersectObject(n.boundingBox) && (TweenLite.killTweensOf(n.position), e <= (T += 1) ? (t.removeIndicator(), L(r.SINK_SEA)) : (t.removeIndicator(), TweenLite.to(n.position, .2, {
            y: n.position.y - 70,
            ease: Back.easeInOut
        }), L(r.WAIT_FOR_CLOSE), TweenLite.delayedCall(1, function () {
            L(r.WAIT_CLICK_SEA), t.addIndicator(S[T])
        })))
    }

    function d(e) {
        E === r.WAIT_CLICK_SEA && t.setCursor(t.intersectObject(n.boundingBox))
    }

    this.init = function () {
        var e;
        (n = new CW.FlowFieldSea(3e3, 3e3, 100)).position.y = -700, n.position.z = 0, n.visible = !1, (e = new THREE.BoxBufferGeometry(1, 1, 1)).applyMatrix((new THREE.Matrix4).makeTranslation(0, -.5, 0)), (o = new THREE.Mesh(e, new THREE.MeshBasicMaterial({color: c}))).scale.set(5e3, 500, 5e3), o.position.y = -2
    }, this.start = function () {
        log("#SceneSea start"), t.changeFogColor(c, 1), t.changeFogNear(3500, 1), t.changeFogFar(6e3, 1), t.setCameraPosition(1336, 2889, -3154), t.changeBackColor(c, function () {
            t.add(n), t.add(o), t.addEventListener("click", u), t.addEventListener("mousemove", d), t.addEventListener("touchstart", A, !1), (a = t.getRobot()).visible = !0, a.position.set(0, 0, -2200), (i = t.getFriend()).visible = !0, i.position.set(-50, 330, -2200), setTimeout(function () {
                L(r.WALK_ROBOT)
            }, 1)
        })
    }, this.update = function () {
        i && i.update(), n && n.update()
    }
}, CW.SceneSea.prototype = Object.create(CW.Scene.prototype), CW.SceneSea.prototype.constructor = CW.SceneSea;
CW.SceneSky = function (o) {
    CW.Scene.call(this), this.name = "SceneSky";
    var t, n, i = this, r = "#364f6b", a = {DEFAULT: "DEFAULT", FLY: "FLY", END: "END"}, s = a.DEFAULT, c = [],
        l = -16e3;

    function e(e) {
        switch (s = e, log("@state", s), s) {
            case a.DEFAULT:
            case a.FLY:
                break;
            case a.END:
                n.remove(robot), o.add(robot), robot.visible = !1, o.remove(t), o.remove(n), CW.Util.forEach(c, function (e) {
                    o.remove(e)
                }), n = c = t = null, robot.visible = !1, robot = null, setTimeout(function () {
                    i.dispatchEvent(i.finishEvent)
                }, 10)
        }
    }

    this.init = function () {
        var i, a;
        (n = new CW.Larva).firstColor = "#fc5185", n.finalColor = "#3fc1c9", n.init(), n.position.set(0, -300, -16e3), n.acceleration.z = .5, n.maxSpeed = 30, a = 0, CW.Util.forEach([{
            pos: {
                x: 500,
                y: 3500,
                z: -15e3
            }, radius: 800
        }, {pos: {x: 800, y: 5e3, z: -17e3}, radius: 300}, {
            pos: {x: 500, y: 3e3, z: -18e3},
            radius: 500
        }, {pos: {x: 500, y: -0, z: -14e3}, radius: 900}, {pos: {x: 500, y: 2e3, z: -24e3}, radius: 700}, {
            pos: {
                x: 500,
                y: 2e3,
                z: -15e3
            }, radius: 500
        }, {pos: {x: 500, y: 1e3, z: -17e3}, radius: 1100}, {
            pos: {x: 500, y: 4e3, z: -21e3},
            radius: 500
        }], function (e, o) {
            i = e.radius, a += 2 * i + 3;
            var t = new CW.Larva(i);
            t.firstColor = "#3fc1c9", t.finalColor = "#f5f5f5", t.position.set(a, e.pos.y, e.pos.z), t.init(), c.push(t)
        }), function () {
            var e = new THREE.BoxBufferGeometry(3e4, 2e4, 8e3);
            e.applyMatrix((new THREE.Matrix4).makeTranslation(0, 0, -5e3));
            var o = new THREE.MeshBasicMaterial({color: r});
            (t = new THREE.Mesh(e, o)).position.z = l
        }()
    }, this.start = function () {
        log("#SceneSky start"), o.changeFogColor(r, 1), o.changeFogNear(5e3, 1), o.changeFogFar(2e4, 1), o.changeBackColor(r, function () {
            o.setCameraPosition(-5913, -4201, 6595), o.plane.visible = !1, o.dirLight.position.set(-205, 2e3, 457), o.add(t), o.add(n), CW.Util.forEach(c, function (e) {
                o.add(e)
            }), robot = o.getRobot(), o.remove(robot), n.add(robot), robot.visible = !0, robot.position.set(0, n.segRadius - 30, 0), robot.headAndNeck.actShake(), robot.actStand(), TweenLite.delayedCall(.5, function () {
                e(a.FLY)
            })
        })
    }, this.update = function () {
        if (s === a.FLY) {
            var t = 99999;
            CW.Util.forEach(c, function (e, o) {
                e.checkOutWall(l), e.update(), t = Math.min(e.position.z - e.depth, t)
            }), n.update(), 3e3 < t && (log("장면 전환"), e(a.END))
        }
    }
}, CW.SceneSky.prototype = Object.create(CW.Scene.prototype), CW.SceneSky.prototype.constructor = CW.SceneSky;
CW.SceneTitle = function (n) {
    CW.Scene.call(this), this.name = "SceneTitle";
    var i, o, a, T = this, s = CW.SceneTitle.sceneColor, r = {
        DEFAULT: "DEFAULT",
        HIDE_CURTAIN: "HIDE_CURTAIN",
        SHOW_START_BUTTON: "SHOW_START_BUTTON",
        WAIT_CLICK_START: "WAIT_CLICK_START",
        FALL_TITLE: "FALL_TITLE",
        FALLED_TITLE: "FALLED_TITLE",
        END: "END"
    }, c = r.DEFAULT;

    function l(e) {
        switch (c = e, log("@state", c), c) {
            case r.DEFAULT:
                break;
            case r.HIDE_CURTAIN:
                n.setBackColor(s), o.show(), a.transition(function () {
                    n.remove(a), TweenLite.delayedCall(1, function () {
                        l(r.SHOW_START_BUTTON)
                    })
                });
                break;
            case r.SHOW_TITLE:
                showTitle();
                break;
            case r.SHOW_START_BUTTON:
                t = Detect.mobileAndTablet() ? "TOUCH" : "CLICK", n.addIndicator(o.position, new THREE.Vector3(0, 100, 0), void 0, t), l(r.WAIT_CLICK_START);
                break;
            case r.WAIT_CLICK_START:
                break;
            case r.FALL_TITLE:
                i.visible = !0, o.fall(), TweenLite.to(n.camera.position, 5, {
                    delay: .6,
                    y: 1600,
                    ease: Sine.easeInOut
                }), TweenLite.to(n.camera.position, 4, {
                    delay: .6,
                    z: 2300,
                    ease: Sine.easeInOut
                }), TweenLite.to(n.camera.position, 4, {
                    delay: 1.3,
                    x: 896,
                    ease: Sine.easeInOut
                }), TweenLite.to(n.control.target, 5, {delay: .7, y: 0, ease: Sine.easeInOut});
                break;
            case r.FALLED_TITLE:
                n.remove(o), n.remove(i), l(r.END);
                break;
            case r.END:
                a = o = i = null, C(), setTimeout(function () {
                    T.dispatchEvent(T.finishEvent)
                }, 10)
        }
        var t
    }

    function L() {
        o.removeEventListener("falled", L), l(r.FALLED_TITLE)
    }

    function C() {
        n.removeEventListener("click", e), n.removeEventListener("mousemove", d), n.removeEventListener("touchstart", t, !1)
    }

    function e() {
        E()
    }

    function t(e) {
        E()
    }

    function E() {
        c === r.WAIT_CLICK_START && n.intersectObject(o.boundingBox) && (C(), n.removeIndicator(.05), n.setCursor(!1), l(r.FALL_TITLE))
    }

    function d(e) {
        c === r.WAIT_CLICK_START && n.setCursor(n.intersectObject(o.boundingBox))
    }

    this.init = function () {
        var e, t;
        e = 800, t = new THREE.PlaneGeometry(e, 400, 20, 20).rotateX(-Math.PI / 2), CW.Util.forEach(t.vertices, function (e, t) {
            -400 !== e.x && 400 !== e.x && -400 !== e.z && 400 !== e.z && (e.x += CW.Util.random(-10, 10), e.z += CW.Util.random(-20, 20), e.y += CW.Util.random(-10, 10))
        }), (i = new THREE.Mesh(t, new THREE.MeshBasicMaterial({color: s}))).visible = !1, (o = new CW.Title).addEventListener("falled", L), (a = new CW.Curtain).position.z = 100, a.position.y = 440
    }, this.start = function () {
        log("#SceneTitle start"), n.isControlCamera = !1, n.add(i), n.add(o), n.add(a), n.addEventListener("click", e), n.addEventListener("mousemove", d), n.addEventListener("touchstart", t, !1), n.setBackColor(s), n.camera.position.set(0, 380, 3e3), n.control.target.set(0, 380, 0), TweenLite.delayedCall(1, function () {
            l(r.HIDE_CURTAIN)
        })
    }, this.update = function () {
        a && a.update(), o && o.update()
    }
}, CW.SceneTitle.prototype = Object.create(CW.Scene.prototype), CW.SceneTitle.prototype.constructor = CW.SceneTitle, CW.SceneTitle.sceneColor = "#2a2a2a";
CW.SceneWall = function (o) {
    CW.Scene.call(this), this.name = "SceneWall";
    var a, i, c, s, O, W, r = this, e = CW.SceneWall.sceneColor, L = {
        DEFAULT: "DEFAULT",
        WALK_ROBOT: "WALK_ROBOT",
        SHOW_DOOR: "SHOW_DOOR",
        WAIT_CLICK_DOOR: "WAIT_CLICK_DOOR",
        OPEN_DOOR: "OPEN_DOOR",
        SHOW_WALL: "SHOW_WALL",
        SHOW_FOOTPRINT: "SHOW_FOOTPRINT",
        SHOW_WALLKEEPER: "SHOW_WALLKEEPER",
        WAIT_CLICK_WALLKEEPER: "WAIT_CLICK_WALLKEEPER",
        CHANGE_COLOR: "CHANGE_COLOR",
        BUILD_TOWER: "BUILD_TOWER",
        HIDE: "HIDE",
        END: "END"
    }, l = L.DEFAULT;

    function C(e) {
        switch (l = e) {
            case L.DEFAULT:
                break;
            case L.WALK_ROBOT:
                O.actRun(), O.headAndNeck.actShake(), TweenLite.to(O.position, 5, {
                    z: 800,
                    ease: Power1.easeOut,
                    onComplete: function () {
                        O.actStand()
                    }
                }), TweenLite.to(W.position, 5, {z: 800, ease: Power1.easeOut}), TweenLite.delayedCall(4, function () {
                    C(L.SHOW_DOOR)
                });
                break;
            case L.SHOW_DOOR:
                a.show(function () {
                    TweenLite.delayedCall(1, function () {
                        C(L.WAIT_CLICK_DOOR)
                    })
                });
                break;
            case L.WAIT_CLICK_DOOR:
                (t = a.position.clone()).y += 100, o.addIndicator(t, void 0, "black");
                break;
            case L.OPEN_DOOR:
                a.open(function () {
                    a.visible = !1
                }), TweenLite.delayedCall(3, function () {
                    C(L.SHOW_WALL)
                });
                break;
            case L.SHOW_WALL:
                i.visible = !0, i.show(), o.changeFogNear(4e3, 1), o.changeFogFar(8e3, 1), TweenLite.delayedCall(4, function () {
                    C(L.SHOW_FOOTPRINT)
                });
                break;
            case L.SHOW_FOOTPRINT:
                s.show(function () {
                    C(L.SHOW_WALLKEEPER)
                });
                break;
            case L.SHOW_WALLKEEPER:
                c.show(function () {
                    C(L.WAIT_CLICK_WALLKEEPER)
                }), TweenLite.delayedCall(2, function () {
                    O.raiseHead(30, 2)
                });
                break;
            case L.WAIT_CLICK_WALLKEEPER:
                (n = c.position.clone()).y += 800, o.addIndicator(n);
                break;
            case L.CHANGE_COLOR:
                c.changeBlack(), i.changeBlack(function () {
                    TweenLite.delayedCall(.5, function () {
                        C(L.BUILD_TOWER)
                    })
                });
                break;
            case L.BUILD_TOWER:
                i.buildTower(function () {
                    C(L.HIDE)
                });
                break;
            case L.HIDE:
                O.visible = !1, W.visible = !1, c.visible = !1, O.aheadHead(.1), i.hide(function () {
                    C(L.END)
                });
                break;
            case L.END:
                o.dirLight.position.set(-1e3, 2e3, 2e3), o.remove(i), o.remove(c), o.remove(s), o.remove(a), W = O = a = s = c = i = null, setTimeout(function () {
                    r.dispatchEvent(r.finishEvent)
                }, 10)
        }
        var n, t
    }

    function n() {
        E()
    }

    function t(e) {
        E()
    }

    function E() {
        l === L.WAIT_CLICK_DOOR ? o.intersectObject(a.boundingBox) && (o.setCursor(!1), o.removeIndicator(), C(L.OPEN_DOOR)) : l === L.WAIT_CLICK_WALLKEEPER && o.intersectObject(c.boundingBox) && (o.setCursor(!1), o.removeIndicator(), C(L.CHANGE_COLOR))
    }

    function d(e) {
        l === L.WAIT_CLICK_DOOR ? o.setCursor(o.intersectObject(a.boundingBox)) : l === L.WAIT_CLICK_WALLKEEPER && o.setCursor(o.intersectObject(c.boundingBox))
    }

    this.init = function () {
        (a = new CW.DoorOnWall).position.z = -500, (i = new CW.Wall(e)).position.z = -600, i.visible = !1, (c = new CW.WallKeeper).scale.set(2.5, 2.5, 2.5), (s = new CW.WallKeeper.FootPrint).position.set(0, -170, -1150)
    }, this.start = function () {
        o.changeFogColor(e, 2), o.changeFogNear(4e3, 2), o.changeFogFar(13e3, 2), o.setCameraPosition(3574, 3530, 3710), o.plane.visible = !0, o.changeBackColor(e, function () {
            o.changeCameraPosition(-2931, 1865, 5188, 4), o.dirLight.position.set(1338, 2882, 3955), (O = o.getRobot()).visible = !0, O.position.set(0, 0, 3e3), O.rotation.y = Math.PI, O.actStand(), O.headAndNeck.actShake(), (W = o.getFriend()).visible = !0, W.rotation.y = Math.PI, W.position.set(-50, 330, 3e3), o.add(a), o.add(i), o.add(c), o.add(s), o.addEventListener("click", n), o.addEventListener("mousemove", d), o.addEventListener("touchstart", t, !1), o.changeColorLogo("#585858"), setTimeout(function () {
                C(L.WALK_ROBOT)
            }, 1)
        })
    }, this.update = function () {
        a && a.update(), c && c.update()
    }
}, CW.SceneWall.prototype = Object.create(CW.Scene.prototype), CW.SceneWall.prototype.constructor = CW.SceneWall, CW.SceneWall.sceneColor = "#fcf3ca";
CW.Font = {}, CW.Font.helvetiker_bold_typeface = {
    glyphs: {
        "ο": {
            x_min: 0,
            x_max: 764,
            ha: 863,
            o: "m 380 -25 q 105 87 211 -25 q 0 372 0 200 q 104 660 0 545 q 380 775 209 775 q 658 659 552 775 q 764 372 764 544 q 658 87 764 200 q 380 -25 552 -25 m 379 142 q 515 216 466 142 q 557 373 557 280 q 515 530 557 465 q 379 607 466 607 q 245 530 294 607 q 204 373 204 465 q 245 218 204 283 q 379 142 294 142 "
        },
        S: {
            x_min: 0,
            x_max: 826,
            ha: 915,
            o: "m 826 306 q 701 55 826 148 q 423 -29 587 -29 q 138 60 255 -29 q 0 318 13 154 l 208 318 q 288 192 216 238 q 437 152 352 152 q 559 181 506 152 q 623 282 623 217 q 466 411 623 372 q 176 487 197 478 q 18 719 18 557 q 136 958 18 869 q 399 1040 244 1040 q 670 956 561 1040 q 791 713 791 864 l 591 713 q 526 826 583 786 q 393 866 469 866 q 277 838 326 866 q 218 742 218 804 q 374 617 218 655 q 667 542 646 552 q 826 306 826 471 "
        },
        "¦": {
            x_min: 0,
            x_max: 143,
            ha: 240,
            o: "m 143 462 l 0 462 l 0 984 l 143 984 l 143 462 m 143 -242 l 0 -242 l 0 280 l 143 280 l 143 -242 "
        },
        "/": {
            x_min: 196.109375,
            x_max: 632.5625,
            ha: 828,
            o: "m 632 1040 l 289 -128 l 196 -128 l 538 1040 l 632 1040 "
        },
        "Τ": {
            x_min: -.609375,
            x_max: 808,
            ha: 878,
            o: "m 808 831 l 508 831 l 508 0 l 298 0 l 298 831 l 0 831 l 0 1013 l 808 1013 l 808 831 "
        },
        y: {
            x_min: 0,
            x_max: 738.890625,
            ha: 828,
            o: "m 738 749 l 444 -107 q 361 -238 413 -199 q 213 -277 308 -277 q 156 -275 176 -277 q 120 -271 131 -271 l 120 -110 q 147 -113 134 -111 q 179 -116 161 -116 q 247 -91 226 -116 q 269 -17 269 -67 q 206 173 269 -4 q 84 515 162 301 q 0 749 41 632 l 218 749 l 376 207 l 529 749 l 738 749 "
        },
        "Π": {
            x_min: 0,
            x_max: 809,
            ha: 922,
            o: "m 809 0 l 598 0 l 598 836 l 208 836 l 208 0 l 0 0 l 0 1012 l 809 1012 l 809 0 "
        },
        "ΐ": {
            x_min: -162,
            x_max: 364,
            ha: 364,
            o: "m 364 810 l 235 810 l 235 952 l 364 952 l 364 810 m 301 1064 l 86 810 l -12 810 l 123 1064 l 301 1064 m -33 810 l -162 810 l -162 952 l -33 952 l -33 810 m 200 0 l 0 0 l 0 748 l 200 748 l 200 0 "
        },
        g: {
            x_min: 0,
            x_max: 724,
            ha: 839,
            o: "m 724 48 q 637 -223 724 -142 q 357 -304 551 -304 q 140 -253 226 -304 q 23 -72 36 -192 l 243 -72 q 290 -127 255 -110 q 368 -144 324 -144 q 504 -82 470 -144 q 530 71 530 -38 l 530 105 q 441 25 496 51 q 319 0 386 0 q 79 115 166 0 q 0 377 0 219 q 77 647 0 534 q 317 775 166 775 q 534 656 456 775 l 534 748 l 724 748 l 724 48 m 368 167 q 492 237 447 167 q 530 382 530 297 q 490 529 530 466 q 364 603 444 603 q 240 532 284 603 q 201 386 201 471 q 240 239 201 300 q 368 167 286 167 "
        },
        "²": {
            x_min: 0,
            x_max: 463,
            ha: 560,
            o: "m 463 791 q 365 627 463 706 q 151 483 258 555 l 455 483 l 455 382 l 0 382 q 84 565 0 488 q 244 672 97 576 q 331 784 331 727 q 299 850 331 824 q 228 876 268 876 q 159 848 187 876 q 132 762 132 820 l 10 762 q 78 924 10 866 q 228 976 137 976 q 392 925 322 976 q 463 791 463 874 "
        },
        "–": {x_min: 0, x_max: 704.171875, ha: 801, o: "m 704 297 l 0 297 l 0 450 l 704 450 l 704 297 "},
        "Κ": {
            x_min: 0,
            x_max: 899.671875,
            ha: 969,
            o: "m 899 0 l 646 0 l 316 462 l 208 355 l 208 0 l 0 0 l 0 1013 l 208 1013 l 208 596 l 603 1013 l 863 1013 l 460 603 l 899 0 "
        },
        "ƒ": {
            x_min: -46,
            x_max: 440,
            ha: 525,
            o: "m 440 609 l 316 609 l 149 -277 l -46 -277 l 121 609 l 14 609 l 14 749 l 121 749 q 159 949 121 894 q 344 1019 208 1019 l 440 1015 l 440 855 l 377 855 q 326 841 338 855 q 314 797 314 827 q 314 773 314 786 q 314 749 314 761 l 440 749 l 440 609 "
        },
        e: {
            x_min: 0,
            x_max: 708,
            ha: 808,
            o: "m 708 321 l 207 321 q 254 186 207 236 q 362 141 298 141 q 501 227 453 141 l 700 227 q 566 36 662 104 q 362 -26 477 -26 q 112 72 213 -26 q 0 369 0 182 q 95 683 0 573 q 358 793 191 793 q 619 677 531 793 q 708 321 708 561 m 501 453 q 460 571 501 531 q 353 612 420 612 q 247 570 287 612 q 207 453 207 529 l 501 453 "
        },
        "ό": {
            x_min: 0,
            x_max: 764,
            ha: 863,
            o: "m 380 -25 q 105 87 211 -25 q 0 372 0 200 q 104 660 0 545 q 380 775 209 775 q 658 659 552 775 q 764 372 764 544 q 658 87 764 200 q 380 -25 552 -25 m 379 142 q 515 216 466 142 q 557 373 557 280 q 515 530 557 465 q 379 607 466 607 q 245 530 294 607 q 204 373 204 465 q 245 218 204 283 q 379 142 294 142 m 593 1039 l 391 823 l 293 823 l 415 1039 l 593 1039 "
        },
        J: {
            x_min: 0,
            x_max: 649,
            ha: 760,
            o: "m 649 294 q 573 48 649 125 q 327 -29 497 -29 q 61 82 136 -29 q 0 375 0 173 l 200 375 l 199 309 q 219 194 199 230 q 321 145 249 145 q 418 193 390 145 q 441 307 441 232 l 441 1013 l 649 1013 l 649 294 "
        },
        "»": {
            x_min: -.234375,
            x_max: 526,
            ha: 624,
            o: "m 526 286 l 297 87 l 296 250 l 437 373 l 297 495 l 297 660 l 526 461 l 526 286 m 229 286 l 0 87 l 0 250 l 140 373 l 0 495 l 0 660 l 229 461 l 229 286 "
        },
        "©": {
            x_min: 3,
            x_max: 1007,
            ha: 1104,
            o: "m 507 -6 q 129 153 269 -6 q 3 506 3 298 q 127 857 3 713 q 502 1017 266 1017 q 880 855 740 1017 q 1007 502 1007 711 q 882 152 1007 295 q 507 -6 743 -6 m 502 934 q 184 800 302 934 q 79 505 79 680 q 184 210 79 331 q 501 76 302 76 q 819 210 701 76 q 925 507 925 331 q 820 800 925 682 q 502 934 704 934 m 758 410 q 676 255 748 313 q 506 197 605 197 q 298 291 374 197 q 229 499 229 377 q 297 713 229 624 q 494 811 372 811 q 666 760 593 811 q 752 616 739 710 l 621 616 q 587 688 621 658 q 509 719 554 719 q 404 658 441 719 q 368 511 368 598 q 403 362 368 427 q 498 298 438 298 q 624 410 606 298 l 758 410 "
        },
        "ώ": {
            x_min: 0,
            x_max: 945,
            ha: 1051,
            o: "m 566 528 l 372 528 l 372 323 q 372 298 372 311 q 373 271 372 285 q 360 183 373 211 q 292 142 342 142 q 219 222 243 142 q 203 365 203 279 q 241 565 203 461 q 334 748 273 650 l 130 748 q 36 552 68 650 q 0 337 0 444 q 69 96 0 204 q 276 -29 149 -29 q 390 0 337 -29 q 470 78 444 28 q 551 0 495 30 q 668 -29 608 -29 q 874 96 793 -29 q 945 337 945 205 q 910 547 945 444 q 814 748 876 650 l 610 748 q 703 565 671 650 q 742 365 742 462 q 718 189 742 237 q 651 142 694 142 q 577 190 597 142 q 565 289 565 221 l 565 323 l 566 528 m 718 1039 l 516 823 l 417 823 l 540 1039 l 718 1039 "
        },
        "^": {
            x_min: 197.21875,
            x_max: 630.5625,
            ha: 828,
            o: "m 630 836 l 536 836 l 413 987 l 294 836 l 197 836 l 331 1090 l 493 1090 l 630 836 "
        },
        "«": {
            x_min: 0,
            x_max: 526.546875,
            ha: 624,
            o: "m 526 87 l 297 286 l 297 461 l 526 660 l 526 495 l 385 373 l 526 250 l 526 87 m 229 87 l 0 286 l 0 461 l 229 660 l 229 495 l 88 373 l 229 250 l 229 87 "
        },
        D: {
            x_min: 0,
            x_max: 864,
            ha: 968,
            o: "m 400 1013 q 736 874 608 1013 q 864 523 864 735 q 717 146 864 293 q 340 0 570 0 l 0 0 l 0 1013 l 400 1013 m 398 837 l 206 837 l 206 182 l 372 182 q 584 276 507 182 q 657 504 657 365 q 594 727 657 632 q 398 837 522 837 "
        },
        "∙": {x_min: 0, x_max: 207, ha: 304, o: "m 207 528 l 0 528 l 0 735 l 207 735 l 207 528 "},
        "ÿ": {
            x_min: 0,
            x_max: 47,
            ha: 125,
            o: "m 47 3 q 37 -7 47 -7 q 28 0 30 -7 q 39 -4 32 -4 q 45 3 45 -1 l 37 0 q 28 9 28 0 q 39 19 28 19 l 47 16 l 47 19 l 47 3 m 37 1 q 44 8 44 1 q 37 16 44 16 q 30 8 30 16 q 37 1 30 1 m 26 1 l 23 22 l 14 0 l 3 22 l 3 3 l 0 25 l 13 1 l 22 25 l 26 1 "
        },
        w: {
            x_min: 0,
            x_max: 1056.953125,
            ha: 1150,
            o: "m 1056 749 l 848 0 l 647 0 l 527 536 l 412 0 l 211 0 l 0 749 l 202 749 l 325 226 l 429 748 l 633 748 l 740 229 l 864 749 l 1056 749 "
        },
        $: {
            x_min: 0,
            x_max: 704,
            ha: 800,
            o: "m 682 693 l 495 693 q 468 782 491 749 q 391 831 441 824 l 391 579 q 633 462 562 534 q 704 259 704 389 q 616 57 704 136 q 391 -22 528 -22 l 391 -156 l 308 -156 l 308 -22 q 76 69 152 -7 q 0 300 0 147 l 183 300 q 215 191 190 230 q 308 128 245 143 l 308 414 q 84 505 157 432 q 12 700 12 578 q 89 902 12 824 q 308 981 166 981 l 308 1069 l 391 1069 l 391 981 q 595 905 521 981 q 682 693 670 829 m 308 599 l 308 831 q 228 796 256 831 q 200 712 200 762 q 225 642 200 668 q 308 599 251 617 m 391 128 q 476 174 449 140 q 504 258 504 207 q 391 388 504 354 l 391 128 "
        },
        "\\": {x_min: -.03125, x_max: 434.765625, ha: 532, o: "m 434 -128 l 341 -128 l 0 1039 l 91 1040 l 434 -128 "},
        "µ": {
            x_min: 0,
            x_max: 647,
            ha: 754,
            o: "m 647 0 l 478 0 l 478 68 q 412 9 448 30 q 330 -11 375 -11 q 261 3 296 -11 q 199 43 226 18 l 199 -277 l 0 -277 l 0 749 l 199 749 l 199 358 q 216 221 199 267 q 322 151 244 151 q 435 240 410 151 q 448 401 448 283 l 448 749 l 647 749 l 647 0 "
        },
        "Ι": {x_min: 42, x_max: 250, ha: 413, o: "m 250 0 l 42 0 l 42 1013 l 250 1013 l 250 0 "},
        "Ύ": {
            x_min: 0,
            x_max: 1211.15625,
            ha: 1289,
            o: "m 1211 1012 l 907 376 l 907 0 l 697 0 l 697 376 l 374 1012 l 583 1012 l 802 576 l 1001 1012 l 1211 1012 m 313 1035 l 98 780 l 0 780 l 136 1035 l 313 1035 "
        },
        "’": {
            x_min: 0,
            x_max: 192,
            ha: 289,
            o: "m 192 834 q 137 692 192 751 q 0 626 83 634 l 0 697 q 101 831 101 723 l 0 831 l 0 1013 l 192 1013 l 192 834 "
        },
        "Ν": {
            x_min: 0,
            x_max: 833,
            ha: 946,
            o: "m 833 0 l 617 0 l 206 696 l 206 0 l 0 0 l 0 1013 l 216 1013 l 629 315 l 629 1013 l 833 1013 l 833 0 "
        },
        "-": {x_min: 27.78125, x_max: 413.890625, ha: 525, o: "m 413 279 l 27 279 l 27 468 l 413 468 l 413 279 "},
        Q: {
            x_min: 0,
            x_max: 995.59375,
            ha: 1096,
            o: "m 995 49 l 885 -70 l 762 42 q 641 -12 709 4 q 497 -29 572 -29 q 135 123 271 -29 q 0 504 0 276 q 131 881 0 731 q 497 1040 270 1040 q 859 883 719 1040 q 994 506 994 731 q 966 321 994 413 q 884 152 938 229 l 995 49 m 730 299 q 767 395 755 344 q 779 504 779 446 q 713 743 779 644 q 505 857 638 857 q 284 745 366 857 q 210 501 210 644 q 279 265 210 361 q 492 157 357 157 q 615 181 557 157 l 508 287 l 620 405 l 730 299 "
        },
        "ς": {
            x_min: 0,
            x_max: 731.78125,
            ha: 768,
            o: "m 731 448 l 547 448 q 485 571 531 533 q 369 610 440 610 q 245 537 292 610 q 204 394 204 473 q 322 186 204 238 q 540 133 430 159 q 659 -15 659 98 q 643 -141 659 -80 q 595 -278 627 -202 l 423 -278 q 458 -186 448 -215 q 474 -88 474 -133 q 352 0 474 -27 q 123 80 181 38 q 0 382 0 170 q 98 660 0 549 q 367 777 202 777 q 622 683 513 777 q 731 448 731 589 "
        },
        M: {
            x_min: 0,
            x_max: 1019,
            ha: 1135,
            o: "m 1019 0 l 823 0 l 823 819 l 618 0 l 402 0 l 194 818 l 194 0 l 0 0 l 0 1013 l 309 1012 l 510 241 l 707 1013 l 1019 1013 l 1019 0 "
        },
        "Ψ": {
            x_min: 0,
            x_max: 995,
            ha: 1085,
            o: "m 995 698 q 924 340 995 437 q 590 200 841 227 l 590 0 l 404 0 l 404 200 q 70 340 152 227 q 0 698 0 437 l 0 1013 l 188 1013 l 188 694 q 212 472 188 525 q 404 383 254 383 l 404 1013 l 590 1013 l 590 383 q 781 472 740 383 q 807 694 807 525 l 807 1013 l 995 1013 l 995 698 "
        },
        C: {
            x_min: 0,
            x_max: 970.828125,
            ha: 1043,
            o: "m 970 345 q 802 70 933 169 q 490 -29 672 -29 q 130 130 268 -29 q 0 506 0 281 q 134 885 0 737 q 502 1040 275 1040 q 802 939 668 1040 q 965 679 936 838 l 745 679 q 649 809 716 761 q 495 857 582 857 q 283 747 361 857 q 214 508 214 648 q 282 267 214 367 q 493 154 359 154 q 651 204 584 154 q 752 345 718 255 l 970 345 "
        },
        "!": {
            x_min: 0,
            x_max: 204,
            ha: 307,
            o: "m 204 739 q 182 515 204 686 q 152 282 167 398 l 52 282 q 13 589 27 473 q 0 739 0 704 l 0 1013 l 204 1013 l 204 739 m 204 0 l 0 0 l 0 203 l 204 203 l 204 0 "
        },
        "{": {
            x_min: 0,
            x_max: 501.390625,
            ha: 599,
            o: "m 501 -285 q 229 -209 301 -285 q 176 -35 176 -155 q 182 47 176 -8 q 189 126 189 103 q 156 245 189 209 q 0 294 112 294 l 0 438 q 154 485 111 438 q 189 603 189 522 q 186 666 189 636 q 176 783 176 772 q 231 945 176 894 q 501 1015 306 1015 l 501 872 q 370 833 408 872 q 340 737 340 801 q 342 677 340 705 q 353 569 353 579 q 326 451 353 496 q 207 366 291 393 q 327 289 294 346 q 353 164 353 246 q 348 79 353 132 q 344 17 344 26 q 372 -95 344 -58 q 501 -141 408 -141 l 501 -285 "
        },
        X: {
            x_min: 0,
            x_max: 894.453125,
            ha: 999,
            o: "m 894 0 l 654 0 l 445 351 l 238 0 l 0 0 l 316 516 l 0 1013 l 238 1013 l 445 659 l 652 1013 l 894 1013 l 577 519 l 894 0 "
        },
        "#": {
            x_min: 0,
            x_max: 1019.453125,
            ha: 1117,
            o: "m 1019 722 l 969 582 l 776 581 l 717 417 l 919 417 l 868 279 l 668 278 l 566 -6 l 413 -5 l 516 279 l 348 279 l 247 -6 l 94 -6 l 196 278 l 0 279 l 49 417 l 245 417 l 304 581 l 98 582 l 150 722 l 354 721 l 455 1006 l 606 1006 l 507 721 l 673 722 l 776 1006 l 927 1006 l 826 721 l 1019 722 m 627 581 l 454 581 l 394 417 l 567 417 l 627 581 "
        },
        "ι": {x_min: 42, x_max: 242, ha: 389, o: "m 242 0 l 42 0 l 42 749 l 242 749 l 242 0 "},
        "Ά": {
            x_min: 0,
            x_max: 995.828125,
            ha: 1072,
            o: "m 313 1035 l 98 780 l 0 780 l 136 1035 l 313 1035 m 995 0 l 776 0 l 708 208 l 315 208 l 247 0 l 29 0 l 390 1012 l 629 1012 l 995 0 m 652 376 l 509 809 l 369 376 l 652 376 "
        },
        ")": {
            x_min: 0,
            x_max: 389,
            ha: 486,
            o: "m 389 357 q 319 14 389 187 q 145 -293 259 -134 l 0 -293 q 139 22 90 -142 q 189 358 189 187 q 139 689 189 525 q 0 1013 90 853 l 145 1013 q 319 703 258 857 q 389 357 389 528 "
        },
        "ε": {
            x_min: 16.671875,
            x_max: 652.78125,
            ha: 742,
            o: "m 652 259 q 565 49 652 123 q 340 -25 479 -25 q 102 39 188 -25 q 16 197 16 104 q 45 299 16 249 q 134 390 75 348 q 58 456 86 419 q 25 552 25 502 q 120 717 25 653 q 322 776 208 776 q 537 710 456 776 q 625 508 625 639 l 445 508 q 415 585 445 563 q 327 608 386 608 q 254 590 293 608 q 215 544 215 573 q 252 469 215 490 q 336 453 280 453 q 369 455 347 453 q 400 456 391 456 l 400 308 l 329 308 q 247 291 280 308 q 204 223 204 269 q 255 154 204 172 q 345 143 286 143 q 426 174 398 143 q 454 259 454 206 l 652 259 "
        },
        "Δ": {
            x_min: 0,
            x_max: 981.953125,
            ha: 1057,
            o: "m 981 0 l 0 0 l 386 1013 l 594 1013 l 981 0 m 715 175 l 490 765 l 266 175 l 715 175 "
        },
        "}": {
            x_min: 0,
            x_max: 500,
            ha: 597,
            o: "m 500 294 q 348 246 390 294 q 315 128 315 209 q 320 42 315 101 q 326 -48 326 -17 q 270 -214 326 -161 q 0 -285 196 -285 l 0 -141 q 126 -97 90 -141 q 154 8 154 -64 q 150 91 154 37 q 146 157 146 145 q 172 281 146 235 q 294 366 206 339 q 173 451 208 390 q 146 576 146 500 q 150 655 146 603 q 154 731 154 708 q 126 831 154 799 q 0 872 90 872 l 0 1015 q 270 944 196 1015 q 326 777 326 891 q 322 707 326 747 q 313 593 313 612 q 347 482 313 518 q 500 438 390 438 l 500 294 "
        },
        "‰": {
            x_min: 0,
            x_max: 1681,
            ha: 1775,
            o: "m 861 484 q 1048 404 979 484 q 1111 228 1111 332 q 1048 51 1111 123 q 859 -29 979 -29 q 672 50 740 -29 q 610 227 610 122 q 672 403 610 331 q 861 484 741 484 m 861 120 q 939 151 911 120 q 967 226 967 183 q 942 299 967 270 q 861 333 912 333 q 783 301 811 333 q 756 226 756 269 q 783 151 756 182 q 861 120 810 120 m 904 984 l 316 -28 l 205 -29 l 793 983 l 904 984 m 250 984 q 436 904 366 984 q 499 730 499 832 q 436 552 499 626 q 248 472 366 472 q 62 552 132 472 q 0 728 0 624 q 62 903 0 831 q 250 984 132 984 m 249 835 q 169 801 198 835 q 140 725 140 768 q 167 652 140 683 q 247 621 195 621 q 327 654 298 621 q 357 730 357 687 q 329 803 357 772 q 249 835 301 835 m 1430 484 q 1618 404 1548 484 q 1681 228 1681 332 q 1618 51 1681 123 q 1429 -29 1548 -29 q 1241 50 1309 -29 q 1179 227 1179 122 q 1241 403 1179 331 q 1430 484 1311 484 m 1431 120 q 1509 151 1481 120 q 1537 226 1537 183 q 1511 299 1537 270 q 1431 333 1482 333 q 1352 301 1380 333 q 1325 226 1325 269 q 1352 151 1325 182 q 1431 120 1379 120 "
        },
        a: {
            x_min: 0,
            x_max: 700,
            ha: 786,
            o: "m 700 0 l 488 0 q 465 93 469 45 q 365 5 427 37 q 233 -26 303 -26 q 65 37 130 -26 q 0 205 0 101 q 120 409 0 355 q 343 452 168 431 q 465 522 465 468 q 424 588 465 565 q 337 611 384 611 q 250 581 285 611 q 215 503 215 552 l 26 503 q 113 707 26 633 q 328 775 194 775 q 538 723 444 775 q 657 554 657 659 l 657 137 q 666 73 657 101 q 700 33 675 45 l 700 0 m 465 297 l 465 367 q 299 322 358 340 q 193 217 193 287 q 223 150 193 174 q 298 127 254 127 q 417 175 370 127 q 465 297 465 224 "
        },
        "—": {x_min: 0, x_max: 941.671875, ha: 1039, o: "m 941 297 l 0 297 l 0 450 l 941 450 l 941 297 "},
        "=": {
            x_min: 29.171875,
            x_max: 798.609375,
            ha: 828,
            o: "m 798 502 l 29 502 l 29 635 l 798 635 l 798 502 m 798 204 l 29 204 l 29 339 l 798 339 l 798 204 "
        },
        N: {
            x_min: 0,
            x_max: 833,
            ha: 949,
            o: "m 833 0 l 617 0 l 206 695 l 206 0 l 0 0 l 0 1013 l 216 1013 l 629 315 l 629 1013 l 833 1013 l 833 0 "
        },
        "ρ": {
            x_min: 0,
            x_max: 722,
            ha: 810,
            o: "m 364 -17 q 271 0 313 -17 q 194 48 230 16 l 194 -278 l 0 -278 l 0 370 q 87 656 0 548 q 358 775 183 775 q 626 655 524 775 q 722 372 722 541 q 621 95 722 208 q 364 -17 520 -17 m 360 607 q 237 529 280 607 q 201 377 201 463 q 234 229 201 292 q 355 147 277 147 q 467 210 419 147 q 515 374 515 273 q 471 537 515 468 q 360 607 428 607 "
        },
        2: {
            x_min: 64,
            x_max: 764,
            ha: 828,
            o: "m 764 685 q 675 452 764 541 q 484 325 637 415 q 307 168 357 250 l 754 168 l 754 0 l 64 0 q 193 301 64 175 q 433 480 202 311 q 564 673 564 576 q 519 780 564 737 q 416 824 475 824 q 318 780 358 824 q 262 633 270 730 l 80 633 q 184 903 80 807 q 415 988 276 988 q 654 907 552 988 q 764 685 764 819 "
        },
        "¯": {x_min: 0, x_max: 775, ha: 771, o: "m 775 958 l 0 958 l 0 1111 l 775 1111 l 775 958 "},
        Z: {
            x_min: 0,
            x_max: 804.171875,
            ha: 906,
            o: "m 804 836 l 251 182 l 793 182 l 793 0 l 0 0 l 0 176 l 551 830 l 11 830 l 11 1013 l 804 1013 l 804 836 "
        },
        u: {
            x_min: 0,
            x_max: 668,
            ha: 782,
            o: "m 668 0 l 474 0 l 474 89 q 363 9 425 37 q 233 -19 301 -19 q 61 53 123 -19 q 0 239 0 126 l 0 749 l 199 749 l 199 296 q 225 193 199 233 q 316 146 257 146 q 424 193 380 146 q 469 304 469 240 l 469 749 l 668 749 l 668 0 "
        },
        k: {
            x_min: 0,
            x_max: 688.890625,
            ha: 771,
            o: "m 688 0 l 450 0 l 270 316 l 196 237 l 196 0 l 0 0 l 0 1013 l 196 1013 l 196 483 l 433 748 l 675 748 l 413 469 l 688 0 "
        },
        "Η": {
            x_min: 0,
            x_max: 837,
            ha: 950,
            o: "m 837 0 l 627 0 l 627 450 l 210 450 l 210 0 l 0 0 l 0 1013 l 210 1013 l 210 635 l 627 635 l 627 1013 l 837 1013 l 837 0 "
        },
        "Α": {
            x_min: 0,
            x_max: 966.671875,
            ha: 1043,
            o: "m 966 0 l 747 0 l 679 208 l 286 208 l 218 0 l 0 0 l 361 1013 l 600 1013 l 966 0 m 623 376 l 480 809 l 340 376 l 623 376 "
        },
        s: {
            x_min: 0,
            x_max: 681,
            ha: 775,
            o: "m 681 229 q 568 33 681 105 q 340 -29 471 -29 q 107 39 202 -29 q 0 245 0 114 l 201 245 q 252 155 201 189 q 358 128 295 128 q 436 144 401 128 q 482 205 482 166 q 363 284 482 255 q 143 348 181 329 q 25 533 25 408 q 129 716 25 647 q 340 778 220 778 q 554 710 465 778 q 658 522 643 643 l 463 522 q 419 596 458 570 q 327 622 380 622 q 255 606 290 622 q 221 556 221 590 q 339 473 221 506 q 561 404 528 420 q 681 229 681 344 "
        },
        B: {
            x_min: 0,
            x_max: 835,
            ha: 938,
            o: "m 674 547 q 791 450 747 518 q 835 304 835 383 q 718 75 835 158 q 461 0 612 0 l 0 0 l 0 1013 l 477 1013 q 697 951 609 1013 q 797 754 797 880 q 765 630 797 686 q 674 547 734 575 m 438 621 q 538 646 495 621 q 590 730 590 676 q 537 814 590 785 q 436 838 494 838 l 199 838 l 199 621 l 438 621 m 445 182 q 561 211 513 182 q 618 311 618 247 q 565 410 618 375 q 444 446 512 446 l 199 446 l 199 182 l 445 182 "
        },
        "…": {
            x_min: 0,
            x_max: 819,
            ha: 963,
            o: "m 206 0 l 0 0 l 0 207 l 206 207 l 206 0 m 512 0 l 306 0 l 306 207 l 512 207 l 512 0 m 819 0 l 613 0 l 613 207 l 819 207 l 819 0 "
        },
        "?": {
            x_min: 1,
            x_max: 687,
            ha: 785,
            o: "m 687 734 q 621 563 687 634 q 501 454 560 508 q 436 293 436 386 l 251 293 l 251 391 q 363 557 251 462 q 476 724 476 653 q 432 827 476 788 q 332 866 389 866 q 238 827 275 866 q 195 699 195 781 l 1 699 q 110 955 1 861 q 352 1040 210 1040 q 582 963 489 1040 q 687 734 687 878 m 446 0 l 243 0 l 243 203 l 446 203 l 446 0 "
        },
        H: {
            x_min: 0,
            x_max: 838,
            ha: 953,
            o: "m 838 0 l 628 0 l 628 450 l 210 450 l 210 0 l 0 0 l 0 1013 l 210 1013 l 210 635 l 628 635 l 628 1013 l 838 1013 l 838 0 "
        },
        "ν": {
            x_min: 0,
            x_max: 740.28125,
            ha: 828,
            o: "m 740 749 l 473 0 l 266 0 l 0 749 l 222 749 l 373 211 l 529 749 l 740 749 "
        },
        c: {
            x_min: 0,
            x_max: 751.390625,
            ha: 828,
            o: "m 751 282 q 625 58 725 142 q 384 -26 526 -26 q 107 84 215 -26 q 0 366 0 195 q 98 651 0 536 q 370 774 204 774 q 616 700 518 774 q 751 486 715 626 l 536 486 q 477 570 516 538 q 380 607 434 607 q 248 533 298 607 q 204 378 204 466 q 242 219 204 285 q 377 139 290 139 q 483 179 438 139 q 543 282 527 220 l 751 282 "
        },
        "¶": {
            x_min: 0,
            x_max: 566.671875,
            ha: 678,
            o: "m 21 892 l 52 892 l 98 761 l 145 892 l 176 892 l 178 741 l 157 741 l 157 867 l 108 741 l 88 741 l 40 871 l 40 741 l 21 741 l 21 892 m 308 854 l 308 731 q 252 691 308 691 q 227 691 240 691 q 207 696 213 695 l 207 712 l 253 706 q 288 733 288 706 l 288 763 q 244 741 279 741 q 193 797 193 741 q 261 860 193 860 q 287 860 273 860 q 308 854 302 855 m 288 842 l 263 843 q 213 796 213 843 q 248 756 213 756 q 288 796 288 756 l 288 842 m 566 988 l 502 988 l 502 -1 l 439 -1 l 439 988 l 317 988 l 317 -1 l 252 -1 l 252 602 q 81 653 155 602 q 0 805 0 711 q 101 989 0 918 q 309 1053 194 1053 l 566 1053 l 566 988 "
        },
        "β": {
            x_min: 0,
            x_max: 703,
            ha: 789,
            o: "m 510 539 q 651 429 600 501 q 703 262 703 357 q 617 53 703 136 q 404 -29 532 -29 q 199 51 279 -29 l 199 -278 l 0 -278 l 0 627 q 77 911 0 812 q 343 1021 163 1021 q 551 957 464 1021 q 649 769 649 886 q 613 638 649 697 q 510 539 577 579 m 344 136 q 452 181 408 136 q 497 291 497 227 q 435 409 497 369 q 299 444 381 444 l 299 600 q 407 634 363 600 q 452 731 452 669 q 417 820 452 784 q 329 857 382 857 q 217 775 246 857 q 199 622 199 725 l 199 393 q 221 226 199 284 q 344 136 254 136 "
        },
        "Μ": {
            x_min: 0,
            x_max: 1019,
            ha: 1132,
            o: "m 1019 0 l 823 0 l 823 818 l 617 0 l 402 0 l 194 818 l 194 0 l 0 0 l 0 1013 l 309 1013 l 509 241 l 708 1013 l 1019 1013 l 1019 0 "
        },
        "Ό": {
            x_min: .15625,
            x_max: 1174,
            ha: 1271,
            o: "m 676 -29 q 312 127 451 -29 q 179 505 179 277 q 311 883 179 733 q 676 1040 449 1040 q 1040 883 901 1040 q 1174 505 1174 733 q 1041 127 1174 277 q 676 -29 903 -29 m 676 154 q 890 266 811 154 q 961 506 961 366 q 891 745 961 648 q 676 857 812 857 q 462 747 541 857 q 392 506 392 648 q 461 266 392 365 q 676 154 540 154 m 314 1034 l 98 779 l 0 779 l 136 1034 l 314 1034 "
        },
        "Ή": {
            x_min: 0,
            x_max: 1248,
            ha: 1361,
            o: "m 1248 0 l 1038 0 l 1038 450 l 621 450 l 621 0 l 411 0 l 411 1012 l 621 1012 l 621 635 l 1038 635 l 1038 1012 l 1248 1012 l 1248 0 m 313 1035 l 98 780 l 0 780 l 136 1035 l 313 1035 "
        },
        "•": {
            x_min: -27.78125,
            x_max: 691.671875,
            ha: 775,
            o: "m 691 508 q 588 252 691 358 q 331 147 486 147 q 77 251 183 147 q -27 508 -27 355 q 75 761 -27 655 q 331 868 179 868 q 585 763 479 868 q 691 508 691 658 "
        },
        "¥": {
            x_min: 0,
            x_max: 836,
            ha: 931,
            o: "m 195 625 l 0 1013 l 208 1013 l 427 576 l 626 1013 l 836 1013 l 650 625 l 777 625 l 777 472 l 578 472 l 538 389 l 777 389 l 777 236 l 532 236 l 532 0 l 322 0 l 322 236 l 79 236 l 79 389 l 315 389 l 273 472 l 79 472 l 79 625 l 195 625 "
        },
        "(": {
            x_min: 0,
            x_max: 388.890625,
            ha: 486,
            o: "m 388 -293 l 243 -293 q 70 14 130 -134 q 0 357 0 189 q 69 703 0 526 q 243 1013 129 856 l 388 1013 q 248 695 297 860 q 200 358 200 530 q 248 24 200 187 q 388 -293 297 -138 "
        },
        U: {
            x_min: 0,
            x_max: 813,
            ha: 926,
            o: "m 813 362 q 697 79 813 187 q 405 -29 582 -29 q 114 78 229 -29 q 0 362 0 186 l 0 1013 l 210 1013 l 210 387 q 260 226 210 291 q 408 154 315 154 q 554 226 500 154 q 603 387 603 291 l 603 1013 l 813 1013 l 813 362 "
        },
        "γ": {
            x_min: .0625,
            x_max: 729.234375,
            ha: 815,
            o: "m 729 749 l 457 37 l 457 -278 l 257 -278 l 257 37 q 218 155 243 95 q 170 275 194 215 l 0 749 l 207 749 l 363 284 l 522 749 l 729 749 "
        },
        "α": {
            x_min: -1,
            x_max: 722,
            ha: 835,
            o: "m 722 0 l 531 0 l 530 101 q 433 8 491 41 q 304 -25 375 -25 q 72 104 157 -25 q -1 372 -1 216 q 72 643 -1 530 q 308 775 158 775 q 433 744 375 775 q 528 656 491 713 l 528 749 l 722 749 l 722 0 m 361 601 q 233 527 277 601 q 196 375 196 464 q 232 224 196 288 q 358 144 277 144 q 487 217 441 144 q 528 370 528 281 q 489 523 528 457 q 361 601 443 601 "
        },
        F: {
            x_min: 0,
            x_max: 706.953125,
            ha: 778,
            o: "m 706 837 l 206 837 l 206 606 l 645 606 l 645 431 l 206 431 l 206 0 l 0 0 l 0 1013 l 706 1013 l 706 837 "
        },
        "­": {x_min: 0, x_max: 704.171875, ha: 801, o: "m 704 297 l 0 297 l 0 450 l 704 450 l 704 297 "},
        ":": {
            x_min: 0,
            x_max: 207,
            ha: 304,
            o: "m 207 528 l 0 528 l 0 735 l 207 735 l 207 528 m 207 0 l 0 0 l 0 207 l 207 207 l 207 0 "
        },
        "Χ": {
            x_min: 0,
            x_max: 894.453125,
            ha: 978,
            o: "m 894 0 l 654 0 l 445 351 l 238 0 l 0 0 l 316 516 l 0 1013 l 238 1013 l 445 660 l 652 1013 l 894 1013 l 577 519 l 894 0 "
        },
        "*": {
            x_min: 115,
            x_max: 713,
            ha: 828,
            o: "m 713 740 l 518 688 l 651 525 l 531 438 l 412 612 l 290 439 l 173 523 l 308 688 l 115 741 l 159 880 l 342 816 l 343 1013 l 482 1013 l 481 816 l 664 880 l 713 740 "
        },
        "†": {
            x_min: 0,
            x_max: 809,
            ha: 894,
            o: "m 509 804 l 809 804 l 809 621 l 509 621 l 509 0 l 299 0 l 299 621 l 0 621 l 0 804 l 299 804 l 299 1011 l 509 1011 l 509 804 "
        },
        "°": {
            x_min: -1,
            x_max: 363,
            ha: 460,
            o: "m 181 808 q 46 862 94 808 q -1 992 -1 917 q 44 1118 -1 1066 q 181 1175 96 1175 q 317 1118 265 1175 q 363 991 363 1066 q 315 862 363 917 q 181 808 267 808 m 181 908 q 240 933 218 908 q 263 992 263 958 q 242 1051 263 1027 q 181 1075 221 1075 q 120 1050 142 1075 q 99 991 99 1026 q 120 933 99 958 q 181 908 142 908 "
        },
        V: {
            x_min: 0,
            x_max: 895.828125,
            ha: 997,
            o: "m 895 1013 l 550 0 l 347 0 l 0 1013 l 231 1013 l 447 256 l 666 1013 l 895 1013 "
        },
        "Ξ": {
            x_min: 0,
            x_max: 751.390625,
            ha: 800,
            o: "m 733 826 l 5 826 l 5 1012 l 733 1012 l 733 826 m 681 432 l 65 432 l 65 617 l 681 617 l 681 432 m 751 0 l 0 0 l 0 183 l 751 183 l 751 0 "
        },
        " ": {x_min: 0, x_max: 0, ha: 853},
        "Ϋ": {
            x_min: -.21875,
            x_max: 836.171875,
            ha: 914,
            o: "m 610 1046 l 454 1046 l 454 1215 l 610 1215 l 610 1046 m 369 1046 l 212 1046 l 212 1215 l 369 1215 l 369 1046 m 836 1012 l 532 376 l 532 0 l 322 0 l 322 376 l 0 1012 l 208 1012 l 427 576 l 626 1012 l 836 1012 "
        },
        0: {
            x_min: 51,
            x_max: 779,
            ha: 828,
            o: "m 415 -26 q 142 129 242 -26 q 51 476 51 271 q 141 825 51 683 q 415 984 242 984 q 687 825 585 984 q 779 476 779 682 q 688 131 779 271 q 415 -26 587 -26 m 415 137 q 529 242 485 137 q 568 477 568 338 q 530 713 568 619 q 415 821 488 821 q 303 718 344 821 q 262 477 262 616 q 301 237 262 337 q 415 137 341 137 "
        },
        "”": {
            x_min: 0,
            x_max: 469,
            ha: 567,
            o: "m 192 834 q 137 692 192 751 q 0 626 83 634 l 0 697 q 101 831 101 723 l 0 831 l 0 1013 l 192 1013 l 192 834 m 469 834 q 414 692 469 751 q 277 626 360 634 l 277 697 q 379 831 379 723 l 277 831 l 277 1013 l 469 1013 l 469 834 "
        },
        "@": {
            x_min: 0,
            x_max: 1276,
            ha: 1374,
            o: "m 1115 -52 q 895 -170 1015 -130 q 647 -211 776 -211 q 158 -34 334 -211 q 0 360 0 123 q 179 810 0 621 q 698 1019 377 1019 q 1138 859 981 1019 q 1276 514 1276 720 q 1173 210 1276 335 q 884 75 1062 75 q 784 90 810 75 q 737 186 749 112 q 647 104 698 133 q 532 75 596 75 q 360 144 420 75 q 308 308 308 205 q 398 568 308 451 q 638 696 497 696 q 731 671 690 696 q 805 604 772 647 l 840 673 l 964 673 q 886 373 915 490 q 856 239 856 257 q 876 201 856 214 q 920 188 895 188 q 1084 284 1019 188 q 1150 511 1150 380 q 1051 779 1150 672 q 715 905 934 905 q 272 734 439 905 q 121 363 121 580 q 250 41 121 170 q 647 -103 394 -103 q 863 -67 751 -103 q 1061 26 975 -32 l 1115 -52 m 769 483 q 770 500 770 489 q 733 567 770 539 q 651 596 695 596 q 508 504 566 596 q 457 322 457 422 q 483 215 457 256 q 561 175 509 175 q 671 221 625 175 q 733 333 718 268 l 769 483 "
        },
        "Ί": {
            x_min: 0,
            x_max: 619,
            ha: 732,
            o: "m 313 1035 l 98 780 l 0 780 l 136 1035 l 313 1035 m 619 0 l 411 0 l 411 1012 l 619 1012 l 619 0 "
        },
        i: {
            x_min: 14,
            x_max: 214,
            ha: 326,
            o: "m 214 830 l 14 830 l 14 1013 l 214 1013 l 214 830 m 214 0 l 14 0 l 14 748 l 214 748 l 214 0 "
        },
        "Β": {
            x_min: 0,
            x_max: 835,
            ha: 961,
            o: "m 675 547 q 791 450 747 518 q 835 304 835 383 q 718 75 835 158 q 461 0 612 0 l 0 0 l 0 1013 l 477 1013 q 697 951 609 1013 q 797 754 797 880 q 766 630 797 686 q 675 547 734 575 m 439 621 q 539 646 496 621 q 590 730 590 676 q 537 814 590 785 q 436 838 494 838 l 199 838 l 199 621 l 439 621 m 445 182 q 561 211 513 182 q 618 311 618 247 q 565 410 618 375 q 444 446 512 446 l 199 446 l 199 182 l 445 182 "
        },
        "υ": {
            x_min: 0,
            x_max: 656,
            ha: 767,
            o: "m 656 416 q 568 55 656 145 q 326 -25 490 -25 q 59 97 137 -25 q 0 369 0 191 l 0 749 l 200 749 l 200 369 q 216 222 200 268 q 326 142 245 142 q 440 247 411 142 q 456 422 456 304 l 456 749 l 656 749 l 656 416 "
        },
        "]": {
            x_min: 0,
            x_max: 349,
            ha: 446,
            o: "m 349 -300 l 0 -300 l 0 -154 l 163 -154 l 163 866 l 0 866 l 0 1013 l 349 1013 l 349 -300 "
        },
        m: {
            x_min: 0,
            x_max: 1065,
            ha: 1174,
            o: "m 1065 0 l 866 0 l 866 483 q 836 564 866 532 q 759 596 807 596 q 663 555 700 596 q 627 454 627 514 l 627 0 l 433 0 l 433 481 q 403 563 433 531 q 323 596 374 596 q 231 554 265 596 q 197 453 197 513 l 197 0 l 0 0 l 0 748 l 189 748 l 189 665 q 279 745 226 715 q 392 775 333 775 q 509 744 455 775 q 606 659 563 713 q 695 744 640 713 q 814 775 749 775 q 992 702 920 775 q 1065 523 1065 630 l 1065 0 "
        },
        "χ": {
            x_min: 0,
            x_max: 759.71875,
            ha: 847,
            o: "m 759 -299 l 548 -299 l 379 66 l 215 -299 l 0 -299 l 261 233 l 13 749 l 230 749 l 379 400 l 527 749 l 738 749 l 500 238 l 759 -299 "
        },
        8: {
            x_min: 57,
            x_max: 770,
            ha: 828,
            o: "m 625 516 q 733 416 697 477 q 770 284 770 355 q 675 69 770 161 q 415 -29 574 -29 q 145 65 244 -29 q 57 273 57 150 q 93 413 57 350 q 204 516 130 477 q 112 609 142 556 q 83 718 83 662 q 177 905 83 824 q 414 986 272 986 q 650 904 555 986 q 745 715 745 822 q 716 608 745 658 q 625 516 688 558 m 414 590 q 516 624 479 590 q 553 706 553 659 q 516 791 553 755 q 414 828 480 828 q 311 792 348 828 q 275 706 275 757 q 310 624 275 658 q 414 590 345 590 m 413 135 q 527 179 487 135 q 564 279 564 218 q 525 386 564 341 q 411 436 482 436 q 298 387 341 436 q 261 282 261 344 q 300 178 261 222 q 413 135 340 135 "
        },
        "ί": {
            x_min: 42,
            x_max: 371.171875,
            ha: 389,
            o: "m 242 0 l 42 0 l 42 748 l 242 748 l 242 0 m 371 1039 l 169 823 l 71 823 l 193 1039 l 371 1039 "
        },
        "Ζ": {
            x_min: 0,
            x_max: 804.171875,
            ha: 886,
            o: "m 804 835 l 251 182 l 793 182 l 793 0 l 0 0 l 0 176 l 551 829 l 11 829 l 11 1012 l 804 1012 l 804 835 "
        },
        R: {
            x_min: 0,
            x_max: 836.109375,
            ha: 947,
            o: "m 836 0 l 608 0 q 588 53 596 20 q 581 144 581 86 q 581 179 581 162 q 581 215 581 197 q 553 345 581 306 q 428 393 518 393 l 208 393 l 208 0 l 0 0 l 0 1013 l 491 1013 q 720 944 630 1013 q 819 734 819 869 q 778 584 819 654 q 664 485 738 513 q 757 415 727 463 q 794 231 794 358 l 794 170 q 800 84 794 116 q 836 31 806 51 l 836 0 m 462 838 l 208 838 l 208 572 l 452 572 q 562 604 517 572 q 612 704 612 640 q 568 801 612 765 q 462 838 525 838 "
        },
        o: {
            x_min: 0,
            x_max: 764,
            ha: 871,
            o: "m 380 -26 q 105 86 211 -26 q 0 371 0 199 q 104 660 0 545 q 380 775 209 775 q 658 659 552 775 q 764 371 764 544 q 658 86 764 199 q 380 -26 552 -26 m 379 141 q 515 216 466 141 q 557 373 557 280 q 515 530 557 465 q 379 607 466 607 q 245 530 294 607 q 204 373 204 465 q 245 217 204 282 q 379 141 294 141 "
        },
        5: {
            x_min: 59,
            x_max: 767,
            ha: 828,
            o: "m 767 319 q 644 59 767 158 q 382 -29 533 -29 q 158 43 247 -29 q 59 264 59 123 l 252 264 q 295 165 252 201 q 400 129 339 129 q 512 172 466 129 q 564 308 564 220 q 514 437 564 387 q 398 488 464 488 q 329 472 361 488 q 271 420 297 456 l 93 428 l 157 958 l 722 958 l 722 790 l 295 790 l 271 593 q 348 635 306 621 q 431 649 389 649 q 663 551 560 649 q 767 319 767 453 "
        },
        7: {
            x_min: 65.28125,
            x_max: 762.5,
            ha: 828,
            o: "m 762 808 q 521 435 604 626 q 409 0 438 244 l 205 0 q 313 422 227 234 q 548 789 387 583 l 65 789 l 65 958 l 762 958 l 762 808 "
        },
        K: {
            x_min: 0,
            x_max: 900,
            ha: 996,
            o: "m 900 0 l 647 0 l 316 462 l 208 355 l 208 0 l 0 0 l 0 1013 l 208 1013 l 208 595 l 604 1013 l 863 1013 l 461 603 l 900 0 "
        },
        ",": {
            x_min: 0,
            x_max: 206,
            ha: 303,
            o: "m 206 5 q 150 -151 206 -88 q 0 -238 94 -213 l 0 -159 q 84 -100 56 -137 q 111 -2 111 -62 l 0 -2 l 0 205 l 206 205 l 206 5 "
        },
        d: {
            x_min: 0,
            x_max: 722,
            ha: 836,
            o: "m 722 0 l 530 0 l 530 101 q 303 -26 449 -26 q 72 103 155 -26 q 0 373 0 214 q 72 642 0 528 q 305 775 156 775 q 433 743 373 775 q 530 656 492 712 l 530 1013 l 722 1013 l 722 0 m 361 600 q 234 523 280 600 q 196 372 196 458 q 233 220 196 286 q 358 143 278 143 q 489 216 442 143 q 530 369 530 280 q 491 522 530 456 q 361 600 443 600 "
        },
        "¨": {
            x_min: 212,
            x_max: 609,
            ha: 933,
            o: "m 609 1046 l 453 1046 l 453 1216 l 609 1216 l 609 1046 m 369 1046 l 212 1046 l 212 1216 l 369 1216 l 369 1046 "
        },
        E: {
            x_min: 0,
            x_max: 761.109375,
            ha: 824,
            o: "m 761 0 l 0 0 l 0 1013 l 734 1013 l 734 837 l 206 837 l 206 621 l 690 621 l 690 446 l 206 446 l 206 186 l 761 186 l 761 0 "
        },
        Y: {
            x_min: 0,
            x_max: 836,
            ha: 931,
            o: "m 836 1013 l 532 376 l 532 0 l 322 0 l 322 376 l 0 1013 l 208 1013 l 427 576 l 626 1013 l 836 1013 "
        },
        '"': {
            x_min: 0,
            x_max: 357,
            ha: 454,
            o: "m 357 604 l 225 604 l 225 988 l 357 988 l 357 604 m 132 604 l 0 604 l 0 988 l 132 988 l 132 604 "
        },
        "‹": {
            x_min: 35.984375,
            x_max: 791.671875,
            ha: 828,
            o: "m 791 17 l 36 352 l 35 487 l 791 823 l 791 672 l 229 421 l 791 168 l 791 17 "
        },
        "„": {
            x_min: 0,
            x_max: 483,
            ha: 588,
            o: "m 206 5 q 150 -151 206 -88 q 0 -238 94 -213 l 0 -159 q 84 -100 56 -137 q 111 -2 111 -62 l 0 -2 l 0 205 l 206 205 l 206 5 m 483 5 q 427 -151 483 -88 q 277 -238 371 -213 l 277 -159 q 361 -100 334 -137 q 388 -2 388 -62 l 277 -2 l 277 205 l 483 205 l 483 5 "
        },
        "δ": {
            x_min: 6,
            x_max: 732,
            ha: 835,
            o: "m 732 352 q 630 76 732 177 q 354 -25 529 -25 q 101 74 197 -25 q 6 333 6 174 q 89 581 6 480 q 323 690 178 690 q 66 864 201 787 l 66 1013 l 669 1013 l 669 856 l 348 856 q 532 729 461 789 q 673 566 625 651 q 732 352 732 465 m 419 551 q 259 496 321 551 q 198 344 198 441 q 238 208 198 267 q 357 140 283 140 q 484 203 437 140 q 526 344 526 260 q 499 466 526 410 q 419 551 473 521 "
        },
        "έ": {
            x_min: 16.671875,
            x_max: 652.78125,
            ha: 742,
            o: "m 652 259 q 565 49 652 123 q 340 -25 479 -25 q 102 39 188 -25 q 16 197 16 104 q 45 299 16 250 q 134 390 75 348 q 58 456 86 419 q 25 552 25 502 q 120 717 25 653 q 322 776 208 776 q 537 710 456 776 q 625 508 625 639 l 445 508 q 415 585 445 563 q 327 608 386 608 q 254 590 293 608 q 215 544 215 573 q 252 469 215 490 q 336 453 280 453 q 369 455 347 453 q 400 456 391 456 l 400 308 l 329 308 q 247 291 280 308 q 204 223 204 269 q 255 154 204 172 q 345 143 286 143 q 426 174 398 143 q 454 259 454 206 l 652 259 m 579 1039 l 377 823 l 279 823 l 401 1039 l 579 1039 "
        },
        "ω": {
            x_min: 0,
            x_max: 945,
            ha: 1051,
            o: "m 565 323 l 565 289 q 577 190 565 221 q 651 142 597 142 q 718 189 694 142 q 742 365 742 237 q 703 565 742 462 q 610 749 671 650 l 814 749 q 910 547 876 650 q 945 337 945 444 q 874 96 945 205 q 668 -29 793 -29 q 551 0 608 -29 q 470 78 495 30 q 390 0 444 28 q 276 -29 337 -29 q 69 96 149 -29 q 0 337 0 204 q 36 553 0 444 q 130 749 68 650 l 334 749 q 241 565 273 650 q 203 365 203 461 q 219 222 203 279 q 292 142 243 142 q 360 183 342 142 q 373 271 373 211 q 372 298 372 285 q 372 323 372 311 l 372 528 l 566 528 l 565 323 "
        },
        "´": {x_min: 0, x_max: 132, ha: 299, o: "m 132 604 l 0 604 l 0 988 l 132 988 l 132 604 "},
        "±": {
            x_min: 29,
            x_max: 798,
            ha: 828,
            o: "m 798 480 l 484 480 l 484 254 l 344 254 l 344 480 l 29 480 l 29 615 l 344 615 l 344 842 l 484 842 l 484 615 l 798 615 l 798 480 m 798 0 l 29 0 l 29 136 l 798 136 l 798 0 "
        },
        "|": {
            x_min: 0,
            x_max: 143,
            ha: 240,
            o: "m 143 462 l 0 462 l 0 984 l 143 984 l 143 462 m 143 -242 l 0 -242 l 0 280 l 143 280 l 143 -242 "
        },
        "ϋ": {
            x_min: 0,
            x_max: 656,
            ha: 767,
            o: "m 535 810 l 406 810 l 406 952 l 535 952 l 535 810 m 271 810 l 142 810 l 142 952 l 271 952 l 271 810 m 656 417 q 568 55 656 146 q 326 -25 490 -25 q 59 97 137 -25 q 0 369 0 192 l 0 748 l 200 748 l 200 369 q 216 222 200 268 q 326 142 245 142 q 440 247 411 142 q 456 422 456 304 l 456 748 l 656 748 l 656 417 "
        },
        "§": {
            x_min: 0,
            x_max: 633,
            ha: 731,
            o: "m 633 469 q 601 356 633 406 q 512 274 569 305 q 570 197 548 242 q 593 105 593 152 q 501 -76 593 -5 q 301 -142 416 -142 q 122 -82 193 -142 q 43 108 43 -15 l 212 108 q 251 27 220 53 q 321 1 283 1 q 389 23 360 1 q 419 83 419 46 q 310 194 419 139 q 108 297 111 295 q 0 476 0 372 q 33 584 0 537 q 120 659 62 626 q 72 720 91 686 q 53 790 53 755 q 133 978 53 908 q 312 1042 207 1042 q 483 984 412 1042 q 574 807 562 921 l 409 807 q 379 875 409 851 q 307 900 349 900 q 244 881 270 900 q 218 829 218 862 q 324 731 218 781 q 524 636 506 647 q 633 469 633 565 m 419 334 q 473 411 473 372 q 451 459 473 436 q 390 502 430 481 l 209 595 q 167 557 182 577 q 153 520 153 537 q 187 461 153 491 q 263 413 212 440 l 419 334 "
        },
        b: {
            x_min: 0,
            x_max: 722,
            ha: 822,
            o: "m 416 -26 q 289 6 346 -26 q 192 101 232 39 l 192 0 l 0 0 l 0 1013 l 192 1013 l 192 656 q 286 743 226 712 q 415 775 346 775 q 649 644 564 775 q 722 374 722 533 q 649 106 722 218 q 416 -26 565 -26 m 361 600 q 232 524 279 600 q 192 371 192 459 q 229 221 192 284 q 357 145 275 145 q 487 221 441 145 q 526 374 526 285 q 488 523 526 460 q 361 600 442 600 "
        },
        q: {
            x_min: 0,
            x_max: 722,
            ha: 833,
            o: "m 722 -298 l 530 -298 l 530 97 q 306 -25 449 -25 q 73 104 159 -25 q 0 372 0 216 q 72 643 0 529 q 305 775 156 775 q 430 742 371 775 q 530 654 488 709 l 530 750 l 722 750 l 722 -298 m 360 601 q 234 527 278 601 q 197 378 197 466 q 233 225 197 291 q 357 144 277 144 q 488 217 441 144 q 530 370 530 282 q 491 523 530 459 q 360 601 443 601 "
        },
        "Ω": {
            x_min: -.03125,
            x_max: 1008.53125,
            ha: 1108,
            o: "m 1008 0 l 589 0 l 589 199 q 717 368 670 265 q 764 580 764 471 q 698 778 764 706 q 504 855 629 855 q 311 773 380 855 q 243 563 243 691 q 289 360 243 458 q 419 199 336 262 l 419 0 l 0 0 l 0 176 l 202 176 q 77 355 123 251 q 32 569 32 459 q 165 908 32 776 q 505 1040 298 1040 q 844 912 711 1040 q 977 578 977 785 q 931 362 977 467 q 805 176 886 256 l 1008 176 l 1008 0 "
        },
        "ύ": {
            x_min: 0,
            x_max: 656,
            ha: 767,
            o: "m 656 417 q 568 55 656 146 q 326 -25 490 -25 q 59 97 137 -25 q 0 369 0 192 l 0 748 l 200 748 l 201 369 q 218 222 201 269 q 326 142 245 142 q 440 247 411 142 q 456 422 456 304 l 456 748 l 656 748 l 656 417 m 579 1039 l 378 823 l 279 823 l 401 1039 l 579 1039 "
        },
        z: {
            x_min: 0,
            x_max: 663.890625,
            ha: 753,
            o: "m 663 0 l 0 0 l 0 154 l 411 591 l 25 591 l 25 749 l 650 749 l 650 584 l 245 165 l 663 165 l 663 0 "
        },
        "™": {
            x_min: 0,
            x_max: 951,
            ha: 1063,
            o: "m 405 921 l 255 921 l 255 506 l 149 506 l 149 921 l 0 921 l 0 1013 l 405 1013 l 405 921 m 951 506 l 852 506 l 852 916 l 750 506 l 643 506 l 539 915 l 539 506 l 442 506 l 442 1013 l 595 1012 l 695 625 l 794 1013 l 951 1013 l 951 506 "
        },
        "ή": {
            x_min: 0,
            x_max: 669,
            ha: 779,
            o: "m 669 -278 l 469 -278 l 469 390 q 448 526 469 473 q 348 606 417 606 q 244 553 288 606 q 201 441 201 501 l 201 0 l 0 0 l 0 749 l 201 749 l 201 665 q 301 744 244 715 q 423 774 359 774 q 606 685 538 774 q 669 484 669 603 l 669 -278 m 495 1039 l 293 823 l 195 823 l 317 1039 l 495 1039 "
        },
        "Θ": {
            x_min: 0,
            x_max: 993,
            ha: 1092,
            o: "m 497 -29 q 133 127 272 -29 q 0 505 0 277 q 133 883 0 733 q 497 1040 272 1040 q 861 883 722 1040 q 993 505 993 733 q 861 127 993 277 q 497 -29 722 -29 m 497 154 q 711 266 631 154 q 782 506 782 367 q 712 746 782 648 q 497 858 634 858 q 281 746 361 858 q 211 506 211 648 q 280 266 211 365 q 497 154 359 154 m 676 430 l 316 430 l 316 593 l 676 593 l 676 430 "
        },
        "®": {
            x_min: 3,
            x_max: 1007,
            ha: 1104,
            o: "m 507 -6 q 129 153 269 -6 q 3 506 3 298 q 127 857 3 713 q 502 1017 266 1017 q 880 855 740 1017 q 1007 502 1007 711 q 882 152 1007 295 q 507 -6 743 -6 m 502 934 q 184 800 302 934 q 79 505 79 680 q 184 210 79 331 q 501 76 302 76 q 819 210 701 76 q 925 507 925 331 q 820 800 925 682 q 502 934 704 934 m 782 190 l 639 190 q 627 225 632 202 q 623 285 623 248 l 623 326 q 603 411 623 384 q 527 439 584 439 l 388 439 l 388 190 l 257 190 l 257 829 l 566 829 q 709 787 654 829 q 772 654 772 740 q 746 559 772 604 q 675 497 720 514 q 735 451 714 483 q 756 341 756 419 l 756 299 q 760 244 756 265 q 782 212 764 223 l 782 190 m 546 718 l 388 718 l 388 552 l 541 552 q 612 572 584 552 q 641 635 641 593 q 614 695 641 672 q 546 718 587 718 "
        },
        "~": {
            x_min: 0,
            x_max: 851,
            ha: 949,
            o: "m 851 968 q 795 750 851 831 q 599 656 730 656 q 406 744 506 656 q 259 832 305 832 q 162 775 193 832 q 139 656 139 730 l 0 656 q 58 871 0 787 q 251 968 124 968 q 442 879 341 968 q 596 791 544 791 q 691 849 663 791 q 712 968 712 892 l 851 968 "
        },
        "Ε": {
            x_min: 0,
            x_max: 761.546875,
            ha: 824,
            o: "m 761 0 l 0 0 l 0 1012 l 735 1012 l 735 836 l 206 836 l 206 621 l 690 621 l 690 446 l 206 446 l 206 186 l 761 186 l 761 0 "
        },
        "³": {
            x_min: 0,
            x_max: 467,
            ha: 564,
            o: "m 467 555 q 393 413 467 466 q 229 365 325 365 q 70 413 134 365 q 0 565 0 467 l 123 565 q 163 484 131 512 q 229 461 190 461 q 299 486 269 461 q 329 553 329 512 q 281 627 329 607 q 187 641 248 641 l 187 722 q 268 737 237 722 q 312 804 312 758 q 285 859 312 837 q 224 882 259 882 q 165 858 189 882 q 135 783 140 834 l 12 783 q 86 930 20 878 q 230 976 145 976 q 379 931 314 976 q 444 813 444 887 q 423 744 444 773 q 365 695 402 716 q 439 640 412 676 q 467 555 467 605 "
        },
        "[": {
            x_min: 0,
            x_max: 347.21875,
            ha: 444,
            o: "m 347 -300 l 0 -300 l 0 1013 l 347 1013 l 347 866 l 188 866 l 188 -154 l 347 -154 l 347 -300 "
        },
        L: {x_min: 0, x_max: 704.171875, ha: 763, o: "m 704 0 l 0 0 l 0 1013 l 208 1013 l 208 186 l 704 186 l 704 0 "},
        "σ": {
            x_min: 0,
            x_max: 851.3125,
            ha: 940,
            o: "m 851 594 l 712 594 q 761 369 761 485 q 658 83 761 191 q 379 -25 555 -25 q 104 87 208 -25 q 0 372 0 200 q 103 659 0 544 q 378 775 207 775 q 464 762 407 775 q 549 750 521 750 l 851 750 l 851 594 m 379 142 q 515 216 466 142 q 557 373 557 280 q 515 530 557 465 q 379 608 465 608 q 244 530 293 608 q 203 373 203 465 q 244 218 203 283 q 379 142 293 142 "
        },
        "ζ": {
            x_min: 0,
            x_max: 622,
            ha: 701,
            o: "m 622 -32 q 604 -158 622 -98 q 551 -278 587 -218 l 373 -278 q 426 -180 406 -229 q 446 -80 446 -131 q 421 -22 446 -37 q 354 -8 397 -8 q 316 -9 341 -8 q 280 -11 291 -11 q 75 69 150 -11 q 0 283 0 150 q 87 596 0 437 q 291 856 162 730 l 47 856 l 47 1013 l 592 1013 l 592 904 q 317 660 422 800 q 197 318 197 497 q 306 141 197 169 q 510 123 408 131 q 622 -32 622 102 "
        },
        "θ": {
            x_min: 0,
            x_max: 714,
            ha: 817,
            o: "m 357 1022 q 633 833 534 1022 q 714 486 714 679 q 634 148 714 288 q 354 -25 536 -25 q 79 147 175 -25 q 0 481 0 288 q 79 831 0 679 q 357 1022 177 1022 m 510 590 q 475 763 510 687 q 351 862 430 862 q 233 763 272 862 q 204 590 204 689 l 510 590 m 510 440 l 204 440 q 233 251 204 337 q 355 131 274 131 q 478 248 434 131 q 510 440 510 337 "
        },
        "Ο": {
            x_min: 0,
            x_max: 995,
            ha: 1092,
            o: "m 497 -29 q 133 127 272 -29 q 0 505 0 277 q 132 883 0 733 q 497 1040 270 1040 q 861 883 722 1040 q 995 505 995 733 q 862 127 995 277 q 497 -29 724 -29 m 497 154 q 711 266 632 154 q 781 506 781 365 q 711 745 781 647 q 497 857 632 857 q 283 747 361 857 q 213 506 213 647 q 282 266 213 365 q 497 154 361 154 "
        },
        "Γ": {
            x_min: 0,
            x_max: 703.84375,
            ha: 742,
            o: "m 703 836 l 208 836 l 208 0 l 0 0 l 0 1012 l 703 1012 l 703 836 "
        },
        " ": {x_min: 0, x_max: 0, ha: 375},
        "%": {
            x_min: 0,
            x_max: 1111,
            ha: 1213,
            o: "m 861 484 q 1048 404 979 484 q 1111 228 1111 332 q 1048 51 1111 123 q 859 -29 979 -29 q 672 50 740 -29 q 610 227 610 122 q 672 403 610 331 q 861 484 741 484 m 861 120 q 939 151 911 120 q 967 226 967 183 q 942 299 967 270 q 861 333 912 333 q 783 301 811 333 q 756 226 756 269 q 783 151 756 182 q 861 120 810 120 m 904 984 l 316 -28 l 205 -29 l 793 983 l 904 984 m 250 984 q 436 904 366 984 q 499 730 499 832 q 436 552 499 626 q 248 472 366 472 q 62 552 132 472 q 0 728 0 624 q 62 903 0 831 q 250 984 132 984 m 249 835 q 169 801 198 835 q 140 725 140 768 q 167 652 140 683 q 247 621 195 621 q 327 654 298 621 q 357 730 357 687 q 329 803 357 772 q 249 835 301 835 "
        },
        P: {
            x_min: 0,
            x_max: 771,
            ha: 838,
            o: "m 208 361 l 208 0 l 0 0 l 0 1013 l 450 1013 q 682 919 593 1013 q 771 682 771 826 q 687 452 771 544 q 466 361 604 361 l 208 361 m 421 837 l 208 837 l 208 544 l 410 544 q 525 579 480 544 q 571 683 571 615 q 527 792 571 747 q 421 837 484 837 "
        },
        "Έ": {
            x_min: 0,
            x_max: 1172.546875,
            ha: 1235,
            o: "m 1172 0 l 411 0 l 411 1012 l 1146 1012 l 1146 836 l 617 836 l 617 621 l 1101 621 l 1101 446 l 617 446 l 617 186 l 1172 186 l 1172 0 m 313 1035 l 98 780 l 0 780 l 136 1035 l 313 1035 "
        },
        "Ώ": {
            x_min: .4375,
            x_max: 1189.546875,
            ha: 1289,
            o: "m 1189 0 l 770 0 l 770 199 q 897 369 849 263 q 945 580 945 474 q 879 778 945 706 q 685 855 810 855 q 492 773 561 855 q 424 563 424 691 q 470 360 424 458 q 600 199 517 262 l 600 0 l 180 0 l 180 176 l 383 176 q 258 355 304 251 q 213 569 213 459 q 346 908 213 776 q 686 1040 479 1040 q 1025 912 892 1040 q 1158 578 1158 785 q 1112 362 1158 467 q 986 176 1067 256 l 1189 176 l 1189 0 m 314 1092 l 99 837 l 0 837 l 136 1092 l 314 1092 "
        },
        _: {x_min: 61.109375, x_max: 766.671875, ha: 828, o: "m 766 -333 l 61 -333 l 61 -190 l 766 -190 l 766 -333 "},
        "Ϊ": {
            x_min: -56,
            x_max: 342,
            ha: 503,
            o: "m 342 1046 l 186 1046 l 186 1215 l 342 1215 l 342 1046 m 101 1046 l -56 1046 l -56 1215 l 101 1215 l 101 1046 m 249 0 l 41 0 l 41 1012 l 249 1012 l 249 0 "
        },
        "+": {
            x_min: 43,
            x_max: 784,
            ha: 828,
            o: "m 784 353 l 483 353 l 483 0 l 343 0 l 343 353 l 43 353 l 43 489 l 343 489 l 343 840 l 483 840 l 483 489 l 784 489 l 784 353 "
        },
        "½": {
            x_min: 0,
            x_max: 1090,
            ha: 1188,
            o: "m 1090 380 q 992 230 1090 301 q 779 101 886 165 q 822 94 784 95 q 924 93 859 93 l 951 93 l 973 93 l 992 93 l 1009 93 q 1046 93 1027 93 q 1085 93 1066 93 l 1085 0 l 650 0 l 654 38 q 815 233 665 137 q 965 376 965 330 q 936 436 965 412 q 869 461 908 461 q 806 435 831 461 q 774 354 780 409 l 659 354 q 724 505 659 451 q 870 554 783 554 q 1024 506 958 554 q 1090 380 1090 459 m 868 998 l 268 -28 l 154 -27 l 757 999 l 868 998 m 272 422 l 147 422 l 147 799 l 0 799 l 0 875 q 126 900 91 875 q 170 973 162 926 l 272 973 l 272 422 "
        },
        "Ρ": {
            x_min: 0,
            x_max: 771,
            ha: 838,
            o: "m 208 361 l 208 0 l 0 0 l 0 1012 l 450 1012 q 682 919 593 1012 q 771 681 771 826 q 687 452 771 544 q 466 361 604 361 l 208 361 m 422 836 l 209 836 l 209 544 l 410 544 q 525 579 480 544 q 571 683 571 614 q 527 791 571 747 q 422 836 484 836 "
        },
        "'": {
            x_min: 0,
            x_max: 192,
            ha: 289,
            o: "m 192 834 q 137 692 192 751 q 0 626 82 632 l 0 697 q 101 830 101 726 l 0 830 l 0 1013 l 192 1013 l 192 834 "
        },
        "ª": {
            x_min: 0,
            x_max: 350,
            ha: 393,
            o: "m 350 625 l 245 625 q 237 648 241 636 q 233 672 233 661 q 117 611 192 611 q 33 643 66 611 q 0 727 0 675 q 116 846 0 828 q 233 886 233 864 q 211 919 233 907 q 168 931 190 931 q 108 877 108 931 l 14 877 q 56 977 14 942 q 165 1013 98 1013 q 270 987 224 1013 q 329 903 329 955 l 329 694 q 332 661 329 675 q 350 641 336 648 l 350 625 m 233 774 l 233 809 q 151 786 180 796 q 97 733 97 768 q 111 700 97 712 q 149 689 126 689 q 210 713 187 689 q 233 774 233 737 "
        },
        "΅": {
            x_min: 57,
            x_max: 584,
            ha: 753,
            o: "m 584 810 l 455 810 l 455 952 l 584 952 l 584 810 m 521 1064 l 305 810 l 207 810 l 343 1064 l 521 1064 m 186 810 l 57 810 l 57 952 l 186 952 l 186 810 "
        },
        T: {
            x_min: 0,
            x_max: 809,
            ha: 894,
            o: "m 809 831 l 509 831 l 509 0 l 299 0 l 299 831 l 0 831 l 0 1013 l 809 1013 l 809 831 "
        },
        "Φ": {
            x_min: 0,
            x_max: 949,
            ha: 1032,
            o: "m 566 0 l 385 0 l 385 121 q 111 230 222 121 q 0 508 0 340 q 112 775 0 669 q 385 892 219 875 l 385 1013 l 566 1013 l 566 892 q 836 776 732 875 q 949 507 949 671 q 838 231 949 341 q 566 121 728 121 l 566 0 m 566 285 q 701 352 650 285 q 753 508 753 419 q 703 658 753 597 q 566 729 653 720 l 566 285 m 385 285 l 385 729 q 245 661 297 717 q 193 516 193 604 q 246 356 193 427 q 385 285 300 285 "
        },
        j: {
            x_min: -45.828125,
            x_max: 242,
            ha: 361,
            o: "m 242 830 l 42 830 l 42 1013 l 242 1013 l 242 830 m 242 -119 q 180 -267 242 -221 q 20 -308 127 -308 l -45 -308 l -45 -140 l -24 -140 q 25 -130 8 -140 q 42 -88 42 -120 l 42 748 l 242 748 l 242 -119 "
        },
        "Σ": {
            x_min: 0,
            x_max: 772.21875,
            ha: 849,
            o: "m 772 0 l 0 0 l 0 140 l 368 526 l 18 862 l 18 1012 l 740 1012 l 740 836 l 315 836 l 619 523 l 298 175 l 772 175 l 772 0 "
        },
        1: {
            x_min: 197.609375,
            x_max: 628,
            ha: 828,
            o: "m 628 0 l 434 0 l 434 674 l 197 674 l 197 810 q 373 837 318 810 q 468 984 450 876 l 628 984 l 628 0 "
        },
        "›": {
            x_min: 36.109375,
            x_max: 792,
            ha: 828,
            o: "m 792 352 l 36 17 l 36 168 l 594 420 l 36 672 l 36 823 l 792 487 l 792 352 "
        },
        "<": {
            x_min: 35.984375,
            x_max: 791.671875,
            ha: 828,
            o: "m 791 17 l 36 352 l 35 487 l 791 823 l 791 672 l 229 421 l 791 168 l 791 17 "
        },
        "£": {
            x_min: 0,
            x_max: 716.546875,
            ha: 814,
            o: "m 716 38 q 603 -9 658 5 q 502 -24 548 -24 q 398 -10 451 -24 q 239 25 266 25 q 161 12 200 25 q 77 -29 122 0 l 0 113 q 110 211 81 174 q 151 315 151 259 q 117 440 151 365 l 0 440 l 0 515 l 73 515 q 35 610 52 560 q 15 710 15 671 q 119 910 15 831 q 349 984 216 984 q 570 910 480 984 q 693 668 674 826 l 501 668 q 455 791 501 746 q 353 830 414 830 q 256 795 298 830 q 215 705 215 760 q 249 583 215 655 q 283 515 266 548 l 479 515 l 479 440 l 309 440 q 316 394 313 413 q 319 355 319 374 q 287 241 319 291 q 188 135 263 205 q 262 160 225 152 q 332 168 298 168 q 455 151 368 168 q 523 143 500 143 q 588 152 558 143 q 654 189 617 162 l 716 38 "
        },
        t: {
            x_min: 0,
            x_max: 412,
            ha: 511,
            o: "m 412 -6 q 349 -8 391 -6 q 287 -11 307 -11 q 137 38 177 -11 q 97 203 97 87 l 97 609 l 0 609 l 0 749 l 97 749 l 97 951 l 297 951 l 297 749 l 412 749 l 412 609 l 297 609 l 297 191 q 315 152 297 162 q 366 143 334 143 q 389 143 378 143 q 412 143 400 143 l 412 -6 "
        },
        "¬": {x_min: 0, x_max: 704, ha: 801, o: "m 704 93 l 551 93 l 551 297 l 0 297 l 0 450 l 704 450 l 704 93 "},
        "λ": {
            x_min: 0,
            x_max: 701.390625,
            ha: 775,
            o: "m 701 0 l 491 0 l 345 444 l 195 0 l 0 0 l 238 697 l 131 1013 l 334 1013 l 701 0 "
        },
        W: {
            x_min: 0,
            x_max: 1291.671875,
            ha: 1399,
            o: "m 1291 1013 l 1002 0 l 802 0 l 645 777 l 490 0 l 288 0 l 0 1013 l 215 1013 l 388 298 l 534 1012 l 757 1013 l 904 299 l 1076 1013 l 1291 1013 "
        },
        ">": {
            x_min: 36.109375,
            x_max: 792,
            ha: 828,
            o: "m 792 352 l 36 17 l 36 168 l 594 420 l 36 672 l 36 823 l 792 487 l 792 352 "
        },
        v: {
            x_min: 0,
            x_max: 740.28125,
            ha: 828,
            o: "m 740 749 l 473 0 l 266 0 l 0 749 l 222 749 l 373 211 l 529 749 l 740 749 "
        },
        "τ": {
            x_min: .28125,
            x_max: 618.734375,
            ha: 699,
            o: "m 618 593 l 409 593 l 409 0 l 210 0 l 210 593 l 0 593 l 0 749 l 618 749 l 618 593 "
        },
        "ξ": {
            x_min: 0,
            x_max: 640,
            ha: 715,
            o: "m 640 -14 q 619 -157 640 -84 q 563 -299 599 -230 l 399 -299 q 442 -194 433 -223 q 468 -85 468 -126 q 440 -25 468 -41 q 368 -10 412 -10 q 333 -11 355 -10 q 302 -13 311 -13 q 91 60 179 -13 q 0 259 0 138 q 56 426 0 354 q 201 530 109 493 q 106 594 144 553 q 65 699 65 642 q 94 787 65 747 q 169 856 123 828 l 22 856 l 22 1013 l 597 1013 l 597 856 l 497 857 q 345 840 398 857 q 257 736 257 812 q 366 614 257 642 q 552 602 416 602 l 552 446 l 513 446 q 313 425 379 446 q 199 284 199 389 q 312 162 199 184 q 524 136 418 148 q 640 -14 640 105 "
        },
        "&": {
            x_min: -1,
            x_max: 910.109375,
            ha: 1007,
            o: "m 910 -1 l 676 -1 l 607 83 q 291 -47 439 -47 q 50 100 135 -47 q -1 273 -1 190 q 51 431 -1 357 q 218 568 104 505 q 151 661 169 629 q 120 769 120 717 q 201 951 120 885 q 382 1013 276 1013 q 555 957 485 1013 q 635 789 635 894 q 584 644 635 709 q 468 539 548 597 l 615 359 q 664 527 654 440 l 844 527 q 725 223 824 359 l 910 -1 m 461 787 q 436 848 461 826 q 381 870 412 870 q 325 849 349 870 q 301 792 301 829 q 324 719 301 757 q 372 660 335 703 q 430 714 405 680 q 461 787 461 753 m 500 214 l 318 441 q 198 286 198 363 q 225 204 198 248 q 347 135 268 135 q 425 153 388 135 q 500 214 462 172 "
        },
        "Λ": {
            x_min: 0,
            x_max: 894.453125,
            ha: 974,
            o: "m 894 0 l 666 0 l 447 757 l 225 0 l 0 0 l 344 1013 l 547 1013 l 894 0 "
        },
        I: {x_min: 41, x_max: 249, ha: 365, o: "m 249 0 l 41 0 l 41 1013 l 249 1013 l 249 0 "},
        G: {
            x_min: 0,
            x_max: 971,
            ha: 1057,
            o: "m 971 -1 l 829 -1 l 805 118 q 479 -29 670 -29 q 126 133 261 -29 q 0 509 0 286 q 130 884 0 737 q 493 1040 268 1040 q 790 948 659 1040 q 961 698 920 857 l 736 698 q 643 813 709 769 q 500 857 578 857 q 285 746 364 857 q 213 504 213 644 q 285 263 213 361 q 505 154 365 154 q 667 217 598 154 q 761 374 736 280 l 548 374 l 548 548 l 971 548 l 971 -1 "
        },
        "ΰ": {
            x_min: 0,
            x_max: 655,
            ha: 767,
            o: "m 583 810 l 454 810 l 454 952 l 583 952 l 583 810 m 186 810 l 57 809 l 57 952 l 186 952 l 186 810 m 516 1039 l 315 823 l 216 823 l 338 1039 l 516 1039 m 655 417 q 567 55 655 146 q 326 -25 489 -25 q 59 97 137 -25 q 0 369 0 192 l 0 748 l 200 748 l 201 369 q 218 222 201 269 q 326 142 245 142 q 439 247 410 142 q 455 422 455 304 l 455 748 l 655 748 l 655 417 "
        },
        "`": {
            x_min: 0,
            x_max: 190,
            ha: 288,
            o: "m 190 654 l 0 654 l 0 830 q 55 970 0 909 q 190 1040 110 1031 l 190 969 q 111 922 134 952 q 88 836 88 892 l 190 836 l 190 654 "
        },
        "·": {x_min: 0, x_max: 207, ha: 304, o: "m 207 528 l 0 528 l 0 735 l 207 735 l 207 528 "},
        "Υ": {
            x_min: -.21875,
            x_max: 836.171875,
            ha: 914,
            o: "m 836 1013 l 532 376 l 532 0 l 322 0 l 322 376 l 0 1013 l 208 1013 l 427 576 l 626 1013 l 836 1013 "
        },
        r: {
            x_min: 0,
            x_max: 431.9375,
            ha: 513,
            o: "m 431 564 q 269 536 320 564 q 200 395 200 498 l 200 0 l 0 0 l 0 748 l 183 748 l 183 618 q 285 731 224 694 q 431 768 345 768 l 431 564 "
        },
        x: {
            x_min: 0,
            x_max: 738.890625,
            ha: 826,
            o: "m 738 0 l 504 0 l 366 238 l 230 0 l 0 0 l 252 382 l 11 749 l 238 749 l 372 522 l 502 749 l 725 749 l 488 384 l 738 0 "
        },
        "μ": {
            x_min: 0,
            x_max: 647,
            ha: 754,
            o: "m 647 0 l 477 0 l 477 68 q 411 9 448 30 q 330 -11 374 -11 q 261 3 295 -11 q 199 43 226 18 l 199 -278 l 0 -278 l 0 749 l 199 749 l 199 358 q 216 222 199 268 q 322 152 244 152 q 435 240 410 152 q 448 401 448 283 l 448 749 l 647 749 l 647 0 "
        },
        h: {
            x_min: 0,
            x_max: 669,
            ha: 782,
            o: "m 669 0 l 469 0 l 469 390 q 449 526 469 472 q 353 607 420 607 q 248 554 295 607 q 201 441 201 501 l 201 0 l 0 0 l 0 1013 l 201 1013 l 201 665 q 303 743 245 715 q 425 772 362 772 q 609 684 542 772 q 669 484 669 605 l 669 0 "
        },
        ".": {x_min: 0, x_max: 206, ha: 303, o: "m 206 0 l 0 0 l 0 207 l 206 207 l 206 0 "},
        "φ": {
            x_min: -1,
            x_max: 921,
            ha: 990,
            o: "m 542 -278 l 367 -278 l 367 -22 q 99 92 200 -22 q -1 376 -1 206 q 72 627 -1 520 q 288 769 151 742 l 288 581 q 222 495 243 550 q 202 378 202 439 q 240 228 202 291 q 367 145 285 157 l 367 776 l 515 776 q 807 667 694 776 q 921 379 921 558 q 815 93 921 209 q 542 -22 709 -22 l 542 -278 m 542 145 q 672 225 625 145 q 713 381 713 291 q 671 536 713 470 q 542 611 624 611 l 542 145 "
        },
        ";": {
            x_min: 0,
            x_max: 208,
            ha: 306,
            o: "m 208 528 l 0 528 l 0 735 l 208 735 l 208 528 m 208 6 q 152 -151 208 -89 q 0 -238 96 -212 l 0 -158 q 87 -100 61 -136 q 113 0 113 -65 l 0 0 l 0 207 l 208 207 l 208 6 "
        },
        f: {
            x_min: 0,
            x_max: 424,
            ha: 525,
            o: "m 424 609 l 300 609 l 300 0 l 107 0 l 107 609 l 0 609 l 0 749 l 107 749 q 145 949 107 894 q 328 1019 193 1019 l 424 1015 l 424 855 l 362 855 q 312 841 324 855 q 300 797 300 827 q 300 773 300 786 q 300 749 300 761 l 424 749 l 424 609 "
        },
        "“": {
            x_min: 0,
            x_max: 468,
            ha: 567,
            o: "m 190 631 l 0 631 l 0 807 q 55 947 0 885 q 190 1017 110 1010 l 190 947 q 88 813 88 921 l 190 813 l 190 631 m 468 631 l 278 631 l 278 807 q 333 947 278 885 q 468 1017 388 1010 l 468 947 q 366 813 366 921 l 468 813 l 468 631 "
        },
        A: {
            x_min: 0,
            x_max: 966.671875,
            ha: 1069,
            o: "m 966 0 l 747 0 l 679 208 l 286 208 l 218 0 l 0 0 l 361 1013 l 600 1013 l 966 0 m 623 376 l 480 810 l 340 376 l 623 376 "
        },
        6: {
            x_min: 57,
            x_max: 771,
            ha: 828,
            o: "m 744 734 l 544 734 q 500 802 533 776 q 425 828 466 828 q 315 769 359 828 q 264 571 264 701 q 451 638 343 638 q 691 537 602 638 q 771 315 771 449 q 683 79 771 176 q 420 -29 586 -29 q 134 123 227 -29 q 57 455 57 250 q 184 865 57 721 q 452 988 293 988 q 657 916 570 988 q 744 734 744 845 m 426 128 q 538 178 498 128 q 578 300 578 229 q 538 422 578 372 q 415 479 493 479 q 303 430 342 479 q 264 313 264 381 q 308 184 264 240 q 426 128 352 128 "
        },
        "‘": {
            x_min: 0,
            x_max: 190,
            ha: 289,
            o: "m 190 631 l 0 631 l 0 807 q 55 947 0 885 q 190 1017 110 1010 l 190 947 q 88 813 88 921 l 190 813 l 190 631 "
        },
        "ϊ": {
            x_min: -55,
            x_max: 337,
            ha: 389,
            o: "m 337 810 l 208 810 l 208 952 l 337 952 l 337 810 m 74 810 l -55 810 l -55 952 l 74 952 l 74 810 m 242 0 l 42 0 l 42 748 l 242 748 l 242 0 "
        },
        "π": {
            x_min: .5,
            x_max: 838.890625,
            ha: 938,
            o: "m 838 593 l 750 593 l 750 0 l 549 0 l 549 593 l 287 593 l 287 0 l 88 0 l 88 593 l 0 593 l 0 749 l 838 749 l 838 593 "
        },
        "ά": {
            x_min: -1,
            x_max: 722,
            ha: 835,
            o: "m 722 0 l 531 0 l 530 101 q 433 8 491 41 q 304 -25 375 -25 q 72 104 157 -25 q -1 372 -1 216 q 72 643 -1 530 q 308 775 158 775 q 433 744 375 775 q 528 656 491 713 l 528 749 l 722 749 l 722 0 m 361 601 q 233 527 277 601 q 196 375 196 464 q 232 224 196 288 q 358 144 277 144 q 487 217 441 144 q 528 370 528 281 q 489 523 528 457 q 361 601 443 601 m 579 1039 l 377 823 l 279 823 l 401 1039 l 579 1039 "
        },
        O: {
            x_min: 0,
            x_max: 994,
            ha: 1094,
            o: "m 497 -29 q 133 127 272 -29 q 0 505 0 277 q 131 883 0 733 q 497 1040 270 1040 q 860 883 721 1040 q 994 505 994 733 q 862 127 994 277 q 497 -29 723 -29 m 497 154 q 710 266 631 154 q 780 506 780 365 q 710 745 780 647 q 497 857 631 857 q 283 747 361 857 q 213 506 213 647 q 282 266 213 365 q 497 154 361 154 "
        },
        n: {
            x_min: 0,
            x_max: 669,
            ha: 782,
            o: "m 669 0 l 469 0 l 469 452 q 442 553 469 513 q 352 601 412 601 q 245 553 290 601 q 200 441 200 505 l 200 0 l 0 0 l 0 748 l 194 748 l 194 659 q 289 744 230 713 q 416 775 349 775 q 600 700 531 775 q 669 509 669 626 l 669 0 "
        },
        3: {
            x_min: 61,
            x_max: 767,
            ha: 828,
            o: "m 767 290 q 653 51 767 143 q 402 -32 548 -32 q 168 48 262 -32 q 61 300 61 140 l 250 300 q 298 173 250 219 q 405 132 343 132 q 514 169 471 132 q 563 282 563 211 q 491 405 563 369 q 343 432 439 432 l 343 568 q 472 592 425 568 q 534 701 534 626 q 493 793 534 758 q 398 829 453 829 q 306 789 344 829 q 268 669 268 749 l 80 669 q 182 909 80 823 q 410 986 274 986 q 633 916 540 986 q 735 719 735 840 q 703 608 735 656 q 615 522 672 561 q 727 427 687 486 q 767 290 767 369 "
        },
        9: {
            x_min: 58,
            x_max: 769,
            ha: 828,
            o: "m 769 492 q 646 90 769 232 q 384 -33 539 -33 q 187 35 271 -33 q 83 224 98 107 l 282 224 q 323 154 286 182 q 404 127 359 127 q 513 182 471 127 q 563 384 563 248 q 475 335 532 355 q 372 315 418 315 q 137 416 224 315 q 58 642 58 507 q 144 877 58 781 q 407 984 239 984 q 694 827 602 984 q 769 492 769 699 m 416 476 q 525 521 488 476 q 563 632 563 566 q 521 764 563 709 q 403 826 474 826 q 297 773 337 826 q 258 649 258 720 q 295 530 258 577 q 416 476 339 476 "
        },
        l: {x_min: 41, x_max: 240, ha: 363, o: "m 240 0 l 41 0 l 41 1013 l 240 1013 l 240 0 "},
        "¤": {
            x_min: 40.265625,
            x_max: 727.203125,
            ha: 825,
            o: "m 727 792 l 594 659 q 620 552 620 609 q 598 459 620 504 l 725 331 l 620 224 l 491 352 q 382 331 443 331 q 273 352 322 331 l 144 224 l 40 330 l 167 459 q 147 552 147 501 q 172 658 147 608 l 40 794 l 147 898 l 283 759 q 383 776 330 776 q 482 759 434 776 l 620 898 l 727 792 m 383 644 q 308 617 334 644 q 283 551 283 590 q 309 489 283 517 q 381 462 335 462 q 456 488 430 462 q 482 554 482 515 q 455 616 482 588 q 383 644 429 644 "
        },
        "κ": {
            x_min: 0,
            x_max: 691.84375,
            ha: 779,
            o: "m 691 0 l 479 0 l 284 343 l 196 252 l 196 0 l 0 0 l 0 749 l 196 749 l 196 490 l 440 749 l 677 749 l 416 479 l 691 0 "
        },
        4: {
            x_min: 53,
            x_max: 775.21875,
            ha: 828,
            o: "m 775 213 l 660 213 l 660 0 l 470 0 l 470 213 l 53 213 l 53 384 l 416 958 l 660 958 l 660 370 l 775 370 l 775 213 m 474 364 l 474 786 l 204 363 l 474 364 "
        },
        p: {
            x_min: 0,
            x_max: 722,
            ha: 824,
            o: "m 415 -26 q 287 4 346 -26 q 192 92 228 34 l 192 -298 l 0 -298 l 0 750 l 192 750 l 192 647 q 289 740 230 706 q 416 775 347 775 q 649 645 566 775 q 722 375 722 534 q 649 106 722 218 q 415 -26 564 -26 m 363 603 q 232 529 278 603 q 192 375 192 465 q 230 222 192 286 q 360 146 276 146 q 487 221 441 146 q 526 371 526 285 q 488 523 526 458 q 363 603 443 603 "
        },
        "‡": {
            x_min: 0,
            x_max: 809,
            ha: 894,
            o: "m 299 621 l 0 621 l 0 804 l 299 804 l 299 1011 l 509 1011 l 509 804 l 809 804 l 809 621 l 509 621 l 509 387 l 809 387 l 809 205 l 509 205 l 509 0 l 299 0 l 299 205 l 0 205 l 0 387 l 299 387 l 299 621 "
        },
        "ψ": {
            x_min: 0,
            x_max: 875,
            ha: 979,
            o: "m 522 142 q 657 274 620 163 q 671 352 671 316 l 671 748 l 875 748 l 875 402 q 806 134 875 240 q 525 -22 719 -1 l 525 -278 l 349 -278 l 349 -22 q 65 135 152 -1 q 0 402 0 238 l 0 748 l 204 748 l 204 352 q 231 240 204 295 q 353 142 272 159 l 353 922 l 524 922 l 522 142 "
        },
        "η": {
            x_min: 0,
            x_max: 669,
            ha: 779,
            o: "m 669 -278 l 469 -278 l 469 390 q 448 526 469 473 q 348 606 417 606 q 244 553 288 606 q 201 441 201 501 l 201 0 l 0 0 l 0 749 l 201 749 l 201 665 q 301 744 244 715 q 423 774 359 774 q 606 685 538 774 q 669 484 669 603 l 669 -278 "
        }
    },
    cssFontWeight: "bold",
    ascender: 1216,
    underlinePosition: -100,
    cssFontStyle: "normal",
    boundingBox: {yMin: -333, xMin: -162, yMax: 1216, xMax: 1681},
    resolution: 1e3,
    original_font_information: {
        postscript_name: "Helvetiker-Bold",
        version_string: "Version 1.00 2004 initial release",
        vendor_url: "http://www.magenta.gr",
        full_font_name: "Helvetiker Bold",
        font_family_name: "Helvetiker",
        copyright: "Copyright (c) Magenta ltd, 2004.",
        description: "",
        trademark: "",
        designer: "",
        designer_url: "",
        unique_font_identifier: "Magenta ltd:Helvetiker Bold:22-10-104",
        license_url: "http://www.ellak.gr/fonts/MgOpen/license.html",
        license_description: 'Copyright (c) 2004 by MAGENTA Ltd. All Rights Reserved.\r\n\r\nPermission is hereby granted, free of charge, to any person obtaining a copy of the fonts accompanying this license ("Fonts") and associated documentation files (the "Font Software"), to reproduce and distribute the Font Software, including without limitation the rights to use, copy, merge, publish, distribute, and/or sell copies of the Font Software, and to permit persons to whom the Font Software is furnished to do so, subject to the following conditions: \r\n\r\nThe above copyright and this permission notice shall be included in all copies of one or more of the Font Software typefaces.\r\n\r\nThe Font Software may be modified, altered, or added to, and in particular the designs of glyphs or characters in the Fonts may be modified and additional glyphs or characters may be added to the Fonts, only if the fonts are renamed to names not containing the word "MgOpen", or if the modifications are accepted for inclusion in the Font Software itself by the each appointed Administrator.\r\n\r\nThis License becomes null and void to the extent applicable to Fonts or Font Software that has been modified and is distributed under the "MgOpen" name.\r\n\r\nThe Font Software may be sold as part of a larger software package but no copy of one or more of the Font Software typefaces may be sold by itself. \r\n\r\nTHE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL MAGENTA OR PERSONS OR BODIES IN CHARGE OF ADMINISTRATION AND MAINTENANCE OF THE FONT SOFTWARE BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM OTHER DEALINGS IN THE FONT SOFTWARE.',
        manufacturer_name: "Magenta ltd",
        font_sub_family_name: "Bold"
    },
    descender: -334,
    familyName: "Helvetiker",
    lineHeight: 1549,
    underlineThickness: 50
};
CW.Egg = function () {
    THREE.Object3D.call(this), this.STATE = {STAND: "STAND", WALK: "WALK", RUN: "RUN"}, this.data = {
        legWidthDepth: 10,
        legHeight: 30,
        bodyRadius: 60,
        bodyHeight: 140,
        eyeRadius: 10,
        armWidth: 40,
        armHeightDepth: 10
    }, this.colors = ["#f62a66", "#6900ff", "#df0054", "#2f4bff", "#ff7100", "#49ded1", "#74dbef", "#3ac569", "#DE5B49", "#AD84C7", "#FFAF53", "#FF0000", "#1646b2", "#f8b430"], this.colors = ["#b6d5e1", "#65799b", "#7e90ad"], this.color = this.colors[0], this.cycle = 0, this.cycleValue = CW.Util.random(.1, .2), this.cycleValue = .2, this.acceleration = new THREE.Vector3(0, 0, CW.Util.random(.04, .14)), this.velocity = new THREE.Vector3(0, 0, 0), this.maxspeed = CW.Util.random(20, 30), this.head, this.leftEye, this.rightEye, this.leftEar, this.rightEar, this.nose, this.noseBar, this.resetData(), this._init()
}, CW.Egg.STATE_STAND = "stand", CW.Egg.STATE_WALK = "walk", CW.Egg.STATE_RUN = "run", CW.Egg.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Egg, update: function () {
        this.visible && (this.cycle += this.cycleValue, this.head.rotation.y = THREE.Math.degToRad(5 * Math.sin(this.cycle)), this.body.rotation.y = THREE.Math.degToRad(5 * Math.sin(this.cycle)), this.leftArm.rotation.x = THREE.Math.degToRad(30 * Math.sin(this.cycle)), this.rightArm.rotation.x = THREE.Math.degToRad(30 * Math.sin(this.cycle + Math.PI / 2)), this.leftLeg.update(), this.rightLeg.update(), this.velocity.add(this.acceleration), this.velocity.length() > this.maxspeed && this.velocity.setLength(this.maxspeed), this.position.add(this.velocity))
    }, actWalk: function () {
        this.state !== this.STATE.WALK && (this.state = this.STATE.WALK, this.leftLeg.actWalk(), this.rightLeg.actWalk())
    }, actRun: function () {
        this.state !== this.STATE.RUN && (this.state = this.STATE.RUN, this.leftLeg.actRun(), this.rightLeg.actRun())
    }, resetData: function () {
        this.data = {
            legWidthDepth: CW.Util.randomFloor(20, 30),
            legHeight: CW.Util.randomFloor(100, 120),
            bodyRadius: CW.Util.randomFloor(60, 150),
            bodyHeight: CW.Util.randomFloor(140, 300),
            eyeRadius: .35 * this.data.bodyRadius,
            armWidth: CW.Util.randomFloor(70, 120),
            armHeightDepth: CW.Util.randomFloor(20, 40)
        }, this.color = this.colors[CW.Util.randomFloor(0, this.colors.length)]
    }, _init: function () {
        this._createLegs(), this._createBody(), this._createHead(), this._createEyes(), this._createArms()
    }, _createHead: function () {
        this.head = new THREE.Mesh(new THREE.SphereBufferGeometry(this.data.bodyRadius, 8, 8, 0, Math.PI).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({
            color: this.color,
            wireframe: !1
        })), this.head.position.y = this.body.position.y + this.data.bodyHeight, this.head.castShadow = !0, this.add(this.head)
    }, _createBody: function () {
        var t = new THREE.CylinderBufferGeometry(this.data.bodyRadius, this.data.bodyRadius, this.data.bodyHeight, 16);
        t.applyMatrix((new THREE.Matrix4).makeTranslation(0, this.data.bodyHeight / 2, 0)), this.body = new THREE.Mesh(t, new THREE.MeshBasicMaterial({
            color: this.color,
            wireframe: !1
        })), this.body.castShadow = !0, this.body.position.y = this.data.legHeight - 2, this.add(this.body)
    }, _createEyes: function () {
        var t = new THREE.Vector3(-30, 0, 52);
        this.rightEye = new THREE.Mesh(new THREE.CylinderBufferGeometry(this.data.eyeRadius, this.data.eyeRadius, 10, 16).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({color: 15658734})), t.setLength(this.data.bodyRadius), this.rightEye.lookAt(t), this.rightEye.position.copy(t), this.head.add(this.rightEye), this.leftEye = new THREE.Mesh(new THREE.CylinderBufferGeometry(this.data.eyeRadius, this.data.eyeRadius, 10, 16).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({color: 15658734})), t.set(30, 0, 52), t.setLength(this.data.bodyRadius), this.leftEye.lookAt(t), this.leftEye.position.copy(t), this.head.add(this.leftEye)
    }, _createLegs: function () {
        this.leftLeg = new CW.Egg.Leg(this.data.legWidthDepth, this.data.legHeight, this.data.legWidthDepth, "left", this.color), this.leftLeg.position.set(-(this.data.legWidthDepth / 2 + 3), this.data.legHeight, 0), this.add(this.leftLeg), this.rightLeg = new CW.Egg.Leg(this.data.legWidthDepth, this.data.legHeight, this.data.legWidthDepth, "right", this.color), this.rightLeg.position.set(this.data.legWidthDepth / 2 + 3, this.data.legHeight, 0), this.add(this.rightLeg)
    }, _createArms: function () {
        var t = new THREE.BoxBufferGeometry(this.data.armWidth, this.data.armHeightDepth, this.data.armHeightDepth);
        this.rightArm = new THREE.Mesh(t.clone().applyMatrix((new THREE.Matrix4).makeTranslation(-this.data.armWidth / 2, 0, 0)), new THREE.MeshBasicMaterial({color: this.color})), this.rightArm.position.set(-(this.data.bodyRadius - 15), this.data.bodyHeight / 2, 0), this.rightArm.rotation.z = THREE.Math.degToRad(60), this.rightArm.castShadow = !0, this.body.add(this.rightArm), this.leftArm = new THREE.Mesh(t.clone().applyMatrix((new THREE.Matrix4).makeTranslation(this.data.armWidth / 2, 0, 0)), new THREE.MeshBasicMaterial({color: this.color})), this.leftArm.position.set(this.data.bodyRadius - 15, this.data.bodyHeight / 2, 0), this.leftArm.rotation.z = THREE.Math.degToRad(-60), this.leftArm.castShadow = !0, this.body.add(this.leftArm)
    }
});
CW.Robot = function () {
    THREE.Object3D.call(this), this.state = CW.Robot.STATE_DEFAULT, this.cycle = 0, this.group, this.body, this.lowerBody, this.headAndNeck, this.leftArm, this.rightArm, this.leftLeg, this.rightLeg, this.boundingBox, this._init()
}, CW.Robot.STATE_DEFAULT = "default", CW.Robot.STATE_STAND = "stand", CW.Robot.STATE_WALK = "walk", CW.Robot.STATE_RUN = "run", CW.Robot.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Robot, update: function (t) {
        this.body.update(t), this.headAndNeck.update(), this.leftArm.update(), this.rightArm.update(), this.lowerBody.update()
    }, actStand: function (t) {
        this.state = CW.Robot.STATE_STAND, this.body.actStand(), this.lowerBody.actStand(), this.leftArm.actStand(), this.rightArm.actStand(), t && TweenLite.delayedCall(.5, function () {
            t && t()
        })
    }, actWalk: function () {
        this.state !== CW.Robot.STATE_WALK && (this.state = CW.Robot.STATE_WALK, this.body.actWalk(), this.lowerBody.actWalk(), this.leftArm.actWalk(), this.rightArm.actWalk())
    }, actRun: function () {
        this.state !== CW.Robot.STATE_RUN && (this.state = CW.Robot.STATE_RUN, this.cycle = 0, this.body.actRun(), this.lowerBody.actRun(), this.leftArm.actRun(), this.rightArm.actRun())
    }, turnRight: function (t, e) {
        e = e || 1, t = Math.max(0, Math.min(t, 180));
        var i = CW.Util.degToRad(-t);
        TweenLite.killTweensOf(this.rotation.y), TweenLite.to(this.rotation, e, {y: i, ease: Sine.easeInOut})
    }, turnLeft: function (t, e) {
        e = e || 1, t = Math.max(0, Math.min(t, 180));
        var i = CW.Util.degToRad(t);
        TweenLite.killTweensOf(this.rotation.y), TweenLite.to(this.rotation, e, {y: i, ease: Sine.easeInOut})
    }, turnDefault: function (t) {
        t = t || 1, TweenLite.killTweensOf(this.rotation.y), TweenLite.to(this.rotation, t, {
            y: 0,
            ease: Sine.easeInOut
        })
    }, actShakeHead: function () {
        this.headAndNeck.head.actShake()
    }, actShakeHeadSide: function () {
        this.headAndNeck.head.actShakeSide()
    }, raiseHead: function (t, e) {
        this.headAndNeck.head.raise(t, e)
    }, lowerHead: function (t, e) {
        this.headAndNeck.head.lower(t, e)
    }, defaultHead: function (t) {
        this.aheadHead(t), this.turnFrontHead(t)
    }, aheadHead: function (t) {
        this.headAndNeck.head.ahead(t)
    }, turnLeftHead: function (t, e) {
        this.headAndNeck.head.turnLeft(t, e)
    }, turnRightHead: function (t, e) {
        this.headAndNeck.head.turnRight(t, e)
    }, turnFrontHead: function (t) {
        this.headAndNeck.head.turnFront(t)
    }, actSayGoodBye: function (t, e) {
        var i = this, o = Math.atan2(t.x - this.position.x, t.z - this.position.z);
        this.headAndNeck.actSayGoodBye(), TweenLite.to(this.rotation, 1, {
            y: o,
            ease: Power1.easeInOut,
            onComplete: function () {
                i.leftArm.actShake(function () {
                    i.leftArm.actStand(), i.headAndNeck.actDefault(), TweenLite.to(i.rotation, 1, {
                        y: -Math.PI,
                        ease: Power1.easeInOut,
                        onComplete: function () {
                            e && e()
                        }
                    })
                })
            }
        })
    }, _init: function () {
        this.group = new THREE.Group, this.add(this.group), this.body = new CW.Robot.Body(110, 80, 100), this.body.position.y = 110, this.group.add(this.body), this.headAndNeck = new CW.Robot.HeadAndNeck, this.headAndNeck.position.set(0, 42, 0), this.body.group.add(this.headAndNeck), this.leftArm = new CW.Robot.Arm("left"), this.leftArm.position.set(this.body.width / 2 + 8, 37, 0), this.body.group.add(this.leftArm), this.rightArm = new CW.Robot.Arm("right"), this.rightArm.position.set(-this.body.width / 2 - 8, 37, 0), this.body.group.add(this.rightArm), this.lowerBody = new CW.Robot.LowerBody, this.lowerBody.position.y = 15, this.body.add(this.lowerBody), this._createBoundingBox()
    }, _createBoundingBox: function () {
        this.boundingBox = new THREE.Mesh(new THREE.BoxBufferGeometry(180, 260, 180), new THREE.MeshBasicMaterial({
            color: 16711680,
            visible: !1,
            wireframe: !0
        })), this.boundingBox.position.y = 130, this.add(this.boundingBox)
    }
});
CW.WallKeeper = function () {
    THREE.Object3D.call(this), this.foots = [], this.legs = [], this.bodies = [], this.head, this.face, this.nose, this.boundingBox, this._init()
}, CW.WallKeeper.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    _constructor: CW.WallKeeper, update: function () {
        this.visible && (CW.Util.forEach(this.bodies, function (e, t) {
            e.rotation.y += e._cycleAcce / 2, e.position.y = e._positionY + 20 * Math.cos(e._cycle), e._cycle += e._cycleAcce
        }), CW.Util.forEach(this.legs, function (e, t) {
            e.rotation.y += e._cycleAcce / 2, e.position.y = e._positionY + 10 * Math.cos(e._cycle), e._cycle += e._cycleAcce
        }), this.head && (this.head.position.y = this.head._positionY + 10 * Math.sin(this.head._cycle), this.head._cycle += this.head._cycleAcce, this.head.rotation.y = Math.sin(this.head._cycle) / 5))
    }, show: function (e) {
        var t = this._showFootsMotion(), i = this._showLegsMotion(t) - 1, o = this._showBodiesMotion(i) - 1;
        this._showHeadMotion(o, function () {
            e && e()
        })
    }, changeBlack: function () {
        CW.Util.forEach(this.bodies, function (e, t) {
            e.material.color.setRGB(0, 0, 0)
        }), CW.Util.forEach(this.legs, function (e, t) {
            e.material.color.setRGB(0, 0, 0)
        }), CW.Util.forEach(this.foots, function (e, t) {
            e.children[0].material.color.setRGB(0, 0, 0)
        })
    }, _init: function () {
        this._createFoots(), this._createLegs(), this._createBody(), this._createHead(), this._createBoundingBox()
    }, _showFootsMotion: function () {
        var i, o, s, a, n, c = 0;
        return CW.Util.forEach(this.foots, function (e, t) {
            i = e.children[0].scale, n = e.children[0], o = .03 * t, s = CW.Util.random(.1, .3), a = CW.Util.random(.3, .6), c = Math.max(c, o + s + a), (new TimelineLite).set(e, {
                delay: o,
                visible: !0
            }).to(i, s, {x: 1, y: 1, ease: Circ.easeInOut}).to(i, a, {
                z: 1,
                ease: Circ.easeInOut
            }, "-=.07"), TweenLite.to(n.rotation, a, {
                delay: o + s,
                x: n._rotationX,
                z: n._rotationZ,
                ease: Circ.easeInOut
            }), TweenLite.to(e.position, a, {delay: o + s + .2, y: e._positionY, ease: Circ.easeInOut})
        }), c
    }, _showLegsMotion: function (i) {
        var o, s, a, n = 0;
        return CW.Util.forEach(this.legs, function (e, t) {
            o = i + .02 * t, s = CW.Util.random(.2, .4), a = CW.Util.random(.6, 1), n = Math.max(n, o + s + a), (new TimelineLite).set(e, {
                delay: o,
                visible: !0
            }).to(e.scale, s, {x: 1, z: 1, ease: Circ.easeInOut}).to(e.scale, a, {y: 1, ease: Circ.easeInOut}, "-=.1")
        }), n
    }, _showBodiesMotion: function (i) {
        var o, s, a, n = 0;
        return CW.Util.forEach(this.bodies, function (e, t) {
            o = i + .02 * t, s = CW.Util.random(.2, .4), a = CW.Util.random(.6, 1), n = Math.max(n, o + s + a), (new TimelineLite).set(e, {
                delay: o,
                visible: !0
            }).to(e.scale, s, {x: 1, z: 1, ease: Circ.easeInOut}).to(e.scale, a, {y: 1, ease: Circ.easeInOut}, "-=.1")
        }), n
    }, _showHeadMotion: function (e, t) {
        var i = new TimelineLite;
        i.set(this.face, {delay: e, visible: !0}).to(this.face.scale, .9, {
            x: 1,
            y: 1,
            z: 1,
            ease: Circ.easeInOut
        }), TweenLite.to(this.head.position, 2, {
            delay: e - .2,
            z: this.head._positionZ,
            ease: Power1.easeInOut
        }), (i = new TimelineLite).set(this.nose, {delay: e + 1, visible: !0}).to(this.nose.scale, .1, {
            x: .4,
            y: .4,
            ease: Circ.easeInOut
        }).to(this.nose.scale, 2, {
            x: 1, y: 1, z: 1, ease: Circ.easeInOut, onComplete: function () {
                t && t()
            }
        }, "-=.1"), TweenLite.to(this.head.rotation, 2, {delay: e + 2, x: CW.Util.degToRad(40)})
    }, _createFoots: function () {
        for (var e, t, i, o, s, a, n, c, h, r = 0, l = 100, d = 0, y = CW.SceneWall.sceneColor, E = 0; E < 40; E++) {
            var f = CW.Util.getColorRgb(y, "#656565", E / 40), u = new THREE.MeshBasicMaterial({color: f});
            n = CW.Util.random(30, 50), c = CW.Util.random(4, 9), h = CW.Util.random(50, 90), o = Math.cos(r) * l, a = Math.sin(r) * l, s = .7 * E, (e = new THREE.BoxBufferGeometry(n, c, h)).applyMatrix((new THREE.Matrix4).makeTranslation(0, 0, h / 2)), (i = new THREE.Group).visible = !1, i._positionY = s, i.position.set(o, 0, a), i.rotation.y = -r - Math.PI / 2, this.add(i), (t = new THREE.Mesh(e, u))._rotationX = -d, t._rotationZ = CW.Util.random(-.4, .4), t.scale.set(.1, .1, .1), i.add(t), this.foots.push(i), r += CW.Util.random(.3, .8), l -= 1.6, d += .02
        }
    }, _createLegs: function () {
        for (var e, t, i, o, s, a = 0, n = 2, c = 0, h = this.foots[this.foots.length - 1].position.y + 80, r = 0, l = 0, d = 3.5, y = [1, 53, 49], E = [79, 11, 59], f = 0; f < 30; f++) {
            var u = CW.Util.pickHex(y, E, f / 30), m = "rgb(" + u[0] + ", " + u[1] + ", " + u[2] + ")",
                C = new THREE.MeshBasicMaterial({color: m});
            n += l, a += .4, l += .14, (d -= .03) < 2.5 && (d = 2.5), c = Math.cos(a) * n, r = Math.sin(a) * n, h += d, i = CW.Util.random(20, 30) + f / 4, o = CW.Util.random(40, 80) + f / 3, s = CW.Util.random(15, 30) + f / 4, (e = new THREE.BoxBufferGeometry(i, o, s)).applyMatrix((new THREE.Matrix4).makeTranslation(0, 0, s / 2)), (t = new THREE.Mesh(e, C)).position.set(c, h, r), t.rotation.y = CW.Util.random(0, Math.PI), t.rotation.x = CW.Util.random(-.4, .4), t._cycle = CW.Util.random(0, 1), t._cycleAcce = CW.Util.random(.01, .04), t._positionY = h, t.visible = !1, t.scale.set(.1, .1, .1), this.add(t), this.legs.push(t)
        }
    }, _createBody: function () {
        for (var e, t, i, o, s, a = 0, n = 0, c = 0, h = this.legs[this.legs.length - 1].position.y + 40, r = 0, l = new THREE.MeshBasicMaterial({color: 3355443}), d = [79, 11, 59], y = [30, 30, 30], E = 0; E < 50; E++) {
            var f = Math.min(E / 30, 1), u = CW.Util.pickHex(d, y, f),
                m = "rgb(" + u[0] + ", " + u[1] + ", " + u[2] + ")";
            l = new THREE.MeshBasicMaterial({color: m});
            i = CW.Util.random(50, 70) + E / 4, o = CW.Util.random(80, 100) + E / 3, s = CW.Util.random(20, 40) + E / 4, n = 35 < E ? 60 - 2 * E : 60, a += .4, c = Math.cos(a) * n, h += 5, r = Math.sin(a) * n, (e = new THREE.BoxBufferGeometry(i, o, s)).applyMatrix((new THREE.Matrix4).makeTranslation(0, 0, s / 2)), (t = new THREE.Mesh(e, l)).rotation.x = CW.Util.random(-.4, .4), t.position.set(c, h, r), t.rotation.y = CW.Util.random(0, Math.PI), t._cycle = CW.Util.random(0, 1), t._cycleAcce = CW.Util.random(.01, .04), t._positionY = h, t.visible = !1, t.scale.set(.1, .1, .1), this.bodies.push(t), this.add(t)
        }
    }, _createHead: function () {
        this.head = new THREE.Group, this.head.position.set(0, 440, 0), this.head._positionY = this.head.position.y, this.head._positionZ = 100, this.head._cycle = 0, this.head._cycleAcce = .02, this.add(this.head), this.face = new THREE.Mesh(new THREE.SphereBufferGeometry(40, 8, 8), new THREE.MeshBasicMaterial({color: 14540253})), this.face.scale.set(.1, .1, .1), this.face.visible = !1, this.head.add(this.face), this.nose = new THREE.Mesh(new THREE.CylinderBufferGeometry(5, 15, 60, 5, 1).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({color: 14639979})), this.nose.scale.set(.1, .1, .1), this.nose.visible = !1, this.nose.position.set(0, 0, 40), this.head.add(this.nose)
    }, _createBoundingBox: function () {
        var e = new THREE.Box3;
        e.setFromObject(this), this.boundingBox = new THREE.Mesh(new THREE.BoxBufferGeometry(e.max.x - e.min.x, e.max.y - e.min.y, e.max.z - e.min.z), new THREE.MeshBasicMaterial({
            color: 16711680,
            wireframe: !0,
            visible: !1
        })), this.boundingBox.position.y = (e.max.y - e.min.y) / 2, this.add(this.boundingBox)
    }
});
CW.BorderBox = function (t, s, i, e, h, o) {
    THREE.Object3D.call(this), this.width = t, this.height = s, this.depth = i, this.ft = o || 4, this.frameColor = h || 16711680, this.planeColor = e || 13421772, this.frameMaterial = new THREE.MeshBasicMaterial({
        color: this.frameColor,
        side: THREE.BackSide
    }), this.planeMaterial = new THREE.MeshBasicMaterial({
        color: this.planeColor,
        wireframe: !1
    }), this.acceleration = new THREE.Vector3(0, -CW.Util.random(.3, 2), 0), this.velocity = new THREE.Vector3(0, -1, 0), this.maxspeed = CW.Util.random(20, 50), this.rotationCycle = CW.Util.random(.001, .02), this.rotationVelocity = new THREE.Vector3(0, 0, 0), this.topFrames = [], this.sideFrames = [], this.bottomFrames = [], this.data, this.isMoving = !1, this._init()
}, CW.BorderBox.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.BorderBox, update: function () {
        this.isMoving && (this.velocity.length() > this.maxspeed ? this.velocity.setLength(this.maxspeed) : this.velocity.add(this.acceleration), this.position.add(this.velocity), this.position.y <= -6e3 && this._reset())
    }, changeScale: function (t, s, i) {
        var e = this;
        this.width = t, this.height = s, this.depth = i, this._resetData(), this.box.scale.set(t, s, i), CW.Util.forEach(this.sideFrames, function (t, s) {
            var i = e.data.sideFrames[s];
            t.scale.set(e.ft, e.height, e.ft), t.position.set(i.posX, i.posY, i.posZ)
        }), CW.Util.forEach(this.topFrames, function (t, s) {
            var i = e.data.topFrames[s];
            "h" === i.type ? t.scale.set(e.width + 2 * e.ft, e.ft, e.ft) : t.scale.set(e.ft, e.ft, e.depth + 2 * e.ft), t.position.set(i.posX, i.posY, i.posZ)
        }), CW.Util.forEach(this.bottomFrames, function (t, s) {
            var i = e.data.bottomFrames[s];
            "h" === i.type ? t.scale.set(e.width + 2 * e.ft, e.ft, e.ft) : t.scale.set(e.ft, e.ft, e.depth + 2 * e.ft), t.position.set(i.posX, i.posY, i.posZ)
        })
    }, _resetData: function () {
        this.data = {
            topFrames: [{
                type: "h",
                posX: 0,
                posY: this.height / 2 + this.ft / 2,
                posZ: -(this.depth / 2 + this.ft / 2)
            }, {
                type: "h",
                posX: 0,
                posY: this.height / 2 + this.ft / 2,
                posZ: this.depth / 2 + this.ft / 2
            }, {
                type: "y",
                posX: -(this.width / 2 + this.ft / 2),
                posY: this.height / 2 + this.ft / 2,
                posZ: 0
            }, {type: "y", posX: this.width / 2 + this.ft / 2, posY: this.height / 2 + this.ft / 2, posZ: 0}],
            bottomFrames: [{
                type: "h",
                posX: 0,
                posY: -(this.height / 2 + this.ft / 2),
                posZ: -(this.depth / 2 + this.ft / 2)
            }, {
                type: "h",
                posX: 0,
                posY: -(this.height / 2 + this.ft / 2),
                posZ: this.depth / 2 + this.ft / 2
            }, {
                type: "v",
                posX: -(this.width / 2 + this.ft / 2),
                posY: -(this.height / 2 + this.ft / 2),
                posZ: 0
            }, {type: "v", posX: this.width / 2 + this.ft / 2, posY: -(this.height / 2 + this.ft / 2), posZ: 0}],
            sideFrames: [{
                posX: this.width / 2 + this.ft / 2,
                posY: 0,
                posZ: -(this.depth / 2 + this.ft / 2)
            }, {
                posX: this.width / 2 + this.ft / 2,
                posY: 0,
                posZ: this.depth / 2 + this.ft / 2
            }, {
                posX: -(this.width / 2 + this.ft / 2),
                posY: 0,
                posZ: -(this.depth / 2 + this.ft / 2)
            }, {posX: -(this.width / 2 + this.ft / 2), posY: 0, posZ: this.depth / 2 + this.ft / 2}]
        }
    }, _reset: function () {
        this.changeScale(CW.Util.random(200, 900), CW.Util.random(800, 2e3), CW.Util.random(200, 800)), this.acceleration = new THREE.Vector3(0, -CW.Util.random(.3, 1.5), 0), this.velocity = new THREE.Vector3(0, -1, 0), this.position.y = CW.Util.random(3e3, 8e3), this.position.x = CW.Util.random(-2600, 2600), this.position.z = CW.Util.random(-500, -2e3)
    }, _init: function () {
        this._resetData(), this._createBox(), this._createTopFrames(), this._createBottomFrames(), this._createSideFrames()
    }, _createSideFrames: function () {
        var e = this, h = new THREE.BoxBufferGeometry(1, 1, 1),
            t = (new THREE.BoxBufferGeometry(this.ft, this.height, this.ft), this.data.sideFrames);
        CW.Util.forEach(t, function (t, s) {
            var i = new THREE.Mesh(h, e.frameMaterial);
            i.scale.set(e.ft, e.height, e.ft), i.position.set(t.posX, t.posY, t.posZ), i.castShadow = !0, e.sideFrames.push(i), e.add(i)
        })
    }, _createTopFrames: function () {
        var e = this, h = new THREE.BoxBufferGeometry(1, 1, 1),
            t = (new THREE.BoxBufferGeometry(this.width + 2 * this.ft, this.ft, this.ft), new THREE.BoxBufferGeometry(this.ft, this.ft, this.depth + 2 * this.ft), this.data.topFrames);
        CW.Util.forEach(t, function (t, s) {
            var i = new THREE.Mesh(h, e.frameMaterial);
            "h" === t.type ? i.scale.set(e.width + 2 * e.ft, e.ft, e.ft) : i.scale.set(e.ft, e.ft, e.depth + 2 * e.ft), i.position.set(t.posX, t.posY, t.posZ), i.castShadow = !0, e.topFrames.push(i), e.add(i)
        })
    }, _createBottomFrames: function () {
        var e = this, h = new THREE.BoxBufferGeometry(1, 1, 1),
            t = (new THREE.BoxBufferGeometry(this.width + 2 * this.ft, this.ft, this.ft), new THREE.BoxBufferGeometry(this.ft, this.ft, this.depth + 2 * this.ft), this.data.bottomFrames);
        CW.Util.forEach(t, function (t, s) {
            var i = new THREE.Mesh(h, e.frameMaterial);
            "h" === t.type ? i.scale.set(e.width + 2 * e.ft, e.ft, e.ft) : i.scale.set(e.ft, e.ft, e.depth + 2 * e.ft), i.position.set(t.posX, t.posY, t.posZ), i.castShadow = !0, e.bottomFrames.push(i), e.add(i)
        })
    }, _createBox: function () {
        this.box = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), this.planeMaterial), this.box.scale.set(this.width, this.height, this.depth), this.add(this.box)
    }
});
CW.Bridge = function () {
    THREE.Object3D.call(this), this.FLOOR_WIDTH = 400, this.FLOOR_HEIGHT = 300, this.FLOOR_DEPTH = 60, this.LENGTH = 1e3, this.firstColor = "#B6567A", this.finalColor = "#E8B599", this.firstColor = "#f2744d", this.finalColor = "#F31BA8", this.firstColor = "#8c8a89", this.finalColor = "#d06c22", this.floors = [], this.leftLights = [], this.rightLights = [], this.isStopUpdate = !1, this._init()
}, CW.Bridge.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Bridge, update: function () {
        if (!this.isStopUpdate) for (var t, i = 0; i < this.leftLights.length; i++) (t = this.leftLights[i])._cycle += .08, t.position.y = t._positionY + 50 * Math.sin(t._cycle), (t = this.rightLights[i])._cycle += .08, t.position.y = t._positionY + 50 * Math.sin(t._cycle)
    }, show: function () {
        CW.Util.forEach(this.floors, function (t, i) {
            var e = .06 * i;
            TweenLite.to(t.material[1], .9, {delay: e + .8, opacity: 1}), TweenLite.to(t.rotation, 4, {
                delay: e,
                z: 0,
                ease: Elastic.easeInOut
            })
        });
        for (var t = 0, i = this.leftLights.length; t < i; t++) TweenLite.set(this.leftLights[t], {
            delay: 3 + .1 * t,
            visible: !0
        }), TweenLite.to(this.leftLights[t], .6, {
            delay: 3 + .1 * t,
            _positionY: 300,
            ease: Power2.easeInOut
        }), TweenLite.set(this.rightLights[t], {
            delay: 3 + .1 * t,
            visible: !0
        }), TweenLite.to(this.rightLights[t], .6, {delay: 3 + .1 * t, _positionY: 300, ease: Power2.easeInOut})
    }, hide: function (t) {
        this.isStopUpdate = !0;
        for (var i = 0, e = this.leftLights.length; i < e; i++) {
            var s = .1 * i;
            TweenLite.set(this.leftLights[i], {
                delay: s + .6,
                visible: !1
            }), TweenLite.to(this.leftLights[i].position, .6, {
                delay: s,
                y: -60,
                ease: Power2.easeInOut
            }), TweenLite.set(this.rightLights[i], {
                delay: s + .6,
                visible: !1
            }), TweenLite.to(this.rightLights[i].position, .6, {delay: s, y: -60, ease: Power2.easeInOut})
        }
        CW.Util.forEach(this.floors, function (t, i) {
            var e = .06 * i;
            TweenLite.to(t.material[1], .9, {delay: e + .9, opacity: 0}), TweenLite.to(t.position, 3, {
                delay: e,
                y: 2e3,
                ease: Elastic.easeInOut
            }), TweenLite.to(t.rotation, 3, {delay: e, x: Math.PI, ease: Elastic.easeInOut})
        }), log(3 + .06 * this.floors.length), TweenLite.delayedCall(3 + .06 * this.floors.length, function () {
            t && t()
        })
    }, _init: function () {
        this._createFloors(), this._createLights()
    }, _createFloors: function () {
        var t, i, e;
        (e = new THREE.BoxGeometry(1, 1, 1)).applyMatrix((new THREE.Matrix4).makeTranslation(0, -.5, 0)), e.faces.forEach(function (t, i) {
            t.materialIndex = 0, 2 !== i && 3 !== i && 4 !== i && 5 !== i && 10 !== i && 11 !== i || (t.materialIndex = 1)
        }), i = new THREE.MeshBasicMaterial({color: CW.SceneBridge.sceneColor, wireframe: !1});
        for (var s = 0; s < 70; s++) {
            var o = s / 70, a = CW.Util.getColorFromGradient(this.firstColor, this.finalColor, o),
                r = "rgb(" + a[0] + ", " + a[1] + ", " + a[2] + ")",
                h = [i, new THREE.MeshLambertMaterial({color: r, transparent: !0, opacity: 0})];
            (t = new THREE.Mesh(e, h)).scale.set(500, CW.Util.random(300, 1500), CW.Util.random(20, 60)), t.position.set(0, 0, s * (this.FLOOR_DEPTH + 3)), t.rotation.z = Math.PI, t.receiveShadow = !0, this.add(t), this.floors.push(t)
        }
    }, _createLights: function () {
        var t, i = new THREE.BoxBufferGeometry(1, 1, 1);
        i.applyMatrix((new THREE.Matrix4).makeTranslation(0, -.5, 0));
        for (var e = 0, s = this.floors.length; e < s; e += 2) {
            var o = e / this.floors.length, a = CW.Util.getColorFromGradient(this.firstColor, this.finalColor, o),
                r = "rgb(" + a[0] + ", " + a[1] + ", " + a[2] + ")", h = new THREE.MeshBasicMaterial({color: r});
            (t = new THREE.Mesh(i, h)).visible = !1, t._cycle = e / (2 * Math.PI), t._positionY = -60, t.scale.set(20, 400, 20), t.position.set(-230, -60, this.floors[e].position.z), this.add(t), this.leftLights.push(t), (t = new THREE.Mesh(i, h)).visible = !1, t._cycle = e / (2 * Math.PI), t._positionY = -60, t.scale.set(20, 400, 20), t.position.set(230, -60, this.floors[e].position.z), this.add(t), this.rightLights.push(t)
        }
    }
});
CW.BridgeLever = function () {
    THREE.Object3D.call(this), this.pulled = !1, this.boundingBox, this.floor, this.bar, this.handle, this.barGroup, this._init()
}, CW.BridgeLever.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.BridgeLever, fall: function (e) {
        TweenLite.to(this.rotation, 4, {
            z: Math.PI / 2, ease: Elastic.easeOut.config(1.5, .2), onComplete: function () {
                e && e()
            }
        }), TweenLite.to(this.position, 5, {y: -300, ease: Elastic.easeOut.config(.7, .2)})
    }, goUp: function (e) {
        TweenLite.killTweensOf(this.rotation), TweenLite.killTweensOf(this.position), TweenLite.to(this.rotation, 1.2, {
            z: 0,
            ease: Back.easeInOut
        }), TweenLite.to(this.position, 1.6, {
            y: 2800, ease: Back.easeInOut, onComplete: function () {
                e && e()
            }
        })
    }, pull: function () {
        this.pulled || (this.pulled = !0, TweenLite.to(this.barGroup.rotation, 1, {
            z: CW.Util.degToRad(40),
            ease: Back.easeInOut
        }))
    }, _init: function () {
        this._createFloor(), this._createBar(), this._createBoundingBox()
    }, _createFloor: function () {
        this.floor = new THREE.Mesh(new THREE.BoxBufferGeometry(80, 30, 80), new THREE.MeshLambertMaterial({color: 8350823})), this.floor.position.y = 15, this.add(this.floor)
    }, _createBar: function () {
        this.barGroup = new THREE.Group, this.barGroup.rotation.z = -CW.Util.degToRad(30), this.add(this.barGroup);
        var e = new THREE.BoxBufferGeometry(16, 150, 16);
        e.applyMatrix((new THREE.Matrix4).makeTranslation(0, 75, 0)), this.bar = new THREE.Mesh(e, new THREE.MeshLambertMaterial({color: 15724527})), this.bar.position.y = 5, this.barGroup.add(this.bar), this.handle = new THREE.Mesh(new THREE.SphereBufferGeometry(40, 8, 8), new THREE.MeshBasicMaterial({color: 8350823})), this.handle.position.set(0, 150, 0), this.barGroup.add(this.handle)
    }, _createBoundingBox: function () {
        this.boundingBox = new THREE.Mesh(new THREE.BoxBufferGeometry(160, 240, 160), new THREE.MeshBasicMaterial({
            color: 16711680,
            visible: !1
        })), this.boundingBox.position.y = 80, this.add(this.boundingBox)
    }
});
CW.DoorOnWall = function () {
    THREE.Object3D.call(this), this.STATE = {
        WAVE: "WAVE",
        OPEN: "OPEN"
    }, this.state = this.STATE.WAVE, this.MIN_ROT_Y = THREE.Math.degToRad(2), this.MAX_ROT_Y = THREE.Math.degToRad(20), this.rotVelocity = .005, this.rotAccelection = -1e-7, this.boxes = [], this.boundingBox, this.planeMat = new THREE.MeshBasicMaterial({
        color: 6710886,
        transparent: !0,
        opacity: 1
    }), this.frameMat = new THREE.MeshBasicMaterial({color: 3355443, transparent: !0, opacity: 1}), this._init()
}, CW.DoorOnWall.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.DoorOnWall, update: function () {
        this.state === this.STATE.WAVE && (this.plane.rotation.y > this.MAX_ROT_Y ? (this.plane.rotation.y = this.MAX_ROT_Y, this.rotVelocity = -.003, this.rotAccelection *= -1) : this.plane.rotation.y < this.MIN_ROT_Y && (this.plane.rotation.y = this.MIN_ROT_Y, this.rotVelocity = .003, this.rotAccelection *= -1), this.rotVelocity += this.rotAccelection, 0 < this.rotAccelection ? this.rotVelocity = Math.min(this.rotVelocity, -.002) : this.rotVelocity = Math.max(this.rotVelocity, .002), this.plane.rotation.y += this.rotVelocity)
    }, show: function (t) {
        this.frameMat.opacity = 0, this.planeMat.opacity = 0, TweenLite.to(this.frameMat, 1, {
            delay: .2,
            opacity: 1
        }), TweenLite.to(this.planeMat, 1, {delay: .2, opacity: 1}), CW.Util.forEach(this.boxes, function (t, i) {
            t.visible = !0, t.position.set(CW.Util.random(-800, -1800), CW.Util.random(1e3, 4e3), CW.Util.random(-600, -800)), TweenLite.to(t.position, CW.Util.random(1, 2), {
                delay: CW.Util.random(0, .5),
                x: t._position.x,
                y: t._position.y,
                z: t._position.z,
                ease: SlowMo.ease.config(.5, .4, !1)
            })
        }), t && TweenLite.delayedCall(2, function () {
            t()
        })
    }, open: function (t) {
        this.state = this.STATE.OPEN;
        var i = this;
        TweenLite.to(this.plane.rotation, 1.3, {
            y: Math.PI / 2, ease: Back.easeInOut, onComplete: function () {
                i._spread(t)
            }
        })
    }, _spread: function (t) {
        TweenLite.to(this.planeMat, 2, {delay: .1, opacity: 0}), TweenLite.to(this.frameMat, 2, {
            delay: .1,
            opacity: 0
        });
        var e = 0;
        CW.Util.forEach(this.boxes, function (t, i) {
            var o = CW.Util.random(1.5, 4) + .003 * i;
            e = Math.max(o, e), TweenLite.to(t.position, o, {
                x: CW.Util.random(-1e3, 1e3),
                z: CW.Util.random(-1e3, 1e3),
                y: CW.Util.random(4e3, 7e3),
                ease: Circ.easeInOut
            }), TweenLite.to(t.rotation, o, {y: CW.Util.random(0, Math.PI), ease: Power3.easeInOut})
        }), TweenLite.delayedCall(e, function () {
            t && t()
        })
    }, _init: function () {
        this._create()
    }, _create: function () {
        this._createFrameBoxes(), this._createPlane(), this._createBoundingBox(), CW.Util.forEach(this.boxes, function (t) {
            t.visible = !1
        })
    }, _createBoundingBox: function () {
        this.boundingBox = new THREE.Mesh(new THREE.BoxBufferGeometry(180, 300, 40), new THREE.MeshBasicMaterial({
            color: 16711680,
            visible: !1
        })), this.boundingBox.position.y = 140, this.add(this.boundingBox)
    }, _createPlane: function () {
        var t, i = 10, o = new THREE.BoxBufferGeometry(i, i, i);
        this.plane = new THREE.Group, this.plane.position.set(60, 0, 0), this.add(this.plane);
        for (var e = 0; e < 23; e++) for (var s = 0; s < 13; s++) (t = new THREE.Mesh(o, this.planeMat)).position.set(-s * i, e * i + 5 + i, 0), t._position = {
            x: t.position.x,
            y: t.position.y,
            z: t.position.z
        }, this.plane.add(t), this.boxes.push(t), t.castShadow = !0;
        this.doorpull = new THREE.Mesh(new THREE.BoxBufferGeometry(10, 10, 40), this.frameMat), this.doorpull.position.set(-110, 125, 0), this.doorpull._position = {
            x: this.doorpull.position.x,
            y: this.doorpull.position.y,
            z: this.doorpull.position.z
        }, this.plane.add(this.doorpull), this.boxes.push(this.doorpull)
    }, _createFrameBoxes: function () {
        var t, i = 10, o = 0, e = 0, s = new THREE.BoxBufferGeometry(i, i, i);
        for (o = 0, e = 25; o < e; o++) (t = new THREE.Mesh(s, this.frameMat)).position.set(-70, 245 - o * i, 0), t._position = {
            x: t.position.x,
            y: t.position.y,
            z: t.position.z
        }, this.boxes.push(t), this.add(t), t.castShadow = !0;
        for (o = 0, e = 25; o < e; o++) (t = new THREE.Mesh(s, this.frameMat)).position.set(70, 245 - o * i, 0), t._position = {
            x: t.position.x,
            y: t.position.y,
            z: t.position.z
        }, this.boxes.push(t), this.add(t), t.castShadow = !0;
        for (o = 0, e = 13; o < e; o++) (t = new THREE.Mesh(s, this.frameMat)).position.set(o * i - 60, 245, 0), t._position = {
            x: t.position.x,
            y: t.position.y,
            z: t.position.z
        }, this.boxes.push(t), this.add(t), t.castShadow = !0;
        for (o = 0, e = 13; o < e; o++) (t = new THREE.Mesh(s, this.frameMat)).position.set(o * i - 60, 5, 0), t._position = {
            x: t.position.x,
            y: t.position.y,
            z: t.position.z
        }, this.boxes.push(t), this.add(t), t.castShadow = !0
    }, _createFrames: function () {
        var t = 10, i = 250, o = new THREE.BoxBufferGeometry(1, 1, 1),
            e = new THREE.MeshLambertMaterial({color: 6710886}), s = new THREE.Mesh(o, e);
        s.scale.set(t, i, t), s.position.set(-70, 125, 0), this.add(s);
        var n = new THREE.Mesh(o, e);
        n.scale.set(t, i, t), n.position.set(70, 125, 0), this.add(n);
        var a = new THREE.Mesh(o, e);
        a.scale.set(140, t, t), a.position.set(0, 245, 0), this.add(a);
        var h = new THREE.Mesh(o, e);
        h.scale.set(140, t, t), h.position.set(0, 5, 0), this.add(h)
    }
});
CW.EatingMonster = function (t) {
    THREE.Object3D.call(this), this.STATE = {
        DEFAULT: "DEFAULT",
        CHASE: "CHASE",
        EAT: "EAT",
        RETURN: "RETURN"
    }, this.state = this.STATE.DEFAULT, this.radius = t || 300, this.isFinished = !1, this.group, this.face, this.leftEye, this.rightEye, this.leftEar, this.rightEar, this.food, this.target = new THREE.Vector3, this.returnTarget = new THREE.Vector3, this.velocity = new THREE.Vector3, this.acceleration = new THREE.Vector3, this.cycle = 0, this.eatEvent = {type: "eat"}, this.swallowEvent = {type: "swallow"}, this.returnEvent = {type: "return"}, this._init()
}, CW.EatingMonster.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.EatingMonster, update: function () {
        if (this.state !== this.STATE.DEFAULT) {
            this.state === this.STATE.CHASE ? (this.velocity.add(this.acceleration), 30 < this.velocity.length() && this.velocity.setLength(30), this.position.add(this.velocity), CW.Util.distanceVector3(this.position, this.target) < 20 && this.eat()) : this.state === this.STATE.RETURN && (this.position.add(this.velocity), CW.Util.distanceVector3(this.position, this.returnTarget) < 20 && (this.state = this.STATE.DEFAULT, this.visible = !1, this.isFinished = !0, this.dispatchEvent(this.returnEvent)));
            Math.cos(this.cycle);
            this.cycle += .05
        }
    }, setTarget: function (t, e, i) {
        this.target.set(t, e, i)
    }, lookAtTarget: function () {
        this.lookAt(this.target)
    }, setFood: function (t) {
        this.food = t
    }, chase: function () {
        this.state = this.STATE.CHASE, this.visible = !0, this.returnTarget.copy(this.position), this.acceleration = this.target.clone().sub(this.position), this.acceleration.setLength(10), this.group.rotation.x = CW.Util.degToRad(-20)
    }, eat: function () {
        this.state = this.STATE.EAT, this.dispatchEvent(this.eatEvent);
        var t = this;
        (new TimelineLite).to(this.group.rotation, .1, {
            y: -.05,
            ease: Power1.easeOut
        }, "-.03").to(this.group.rotation, .1, {
            y: .02,
            ease: Power1.easeOut
        }, "-.03").to(this.group.rotation, .1, {
            y: 0,
            ease: Power1.easeOut
        }), TweenLite.to(this.group.rotation, 1.5, {
            delay: .2,
            x: CW.Util.degToRad(-5),
            ease: Power3.easeInOut,
            onComplete: function () {
                t.swallow()
            }
        })
    }, swallow: function () {
        this.state = this.STATE.RETURN;
        var t = new THREE.Mesh(this.face.geometry.clone());
        t.position.copy(this.position);
        var e = new ThreeBSP(t), i = new ThreeBSP(this.food).subtract(e).toMesh().geometry;
        this.food.geometry = i, this.food.geometry.computeVertexNormals(), this.food = null, this.velocity.multiplyScalar(-1);
        var s = Math.random() < .5 ? Math.PI : -Math.PI;
        TweenLite.to(this.group.rotation, 7, {y: s}), this.dispatchEvent(this.swallowEvent)
    }, _init: function () {
        this.group = new THREE.Group, this.add(this.group), this._createFace(), this._createEyes(), this._createEars(), this.visible = !1
    }, _createFace: function () {
        var t = new THREE.SphereGeometry(this.radius, 12, 12),
            e = new THREE.MeshBasicMaterial({color: 11184810, wireframe: !1});
        this.face = new THREE.Mesh(t, e), this.group.add(this.face)
    }, _createEyes: function () {
        var t = .23 * this.radius, e = new THREE.MeshBasicMaterial({color: 5592405, wireframe: !1}),
            i = new THREE.CylinderBufferGeometry(t, t, 30, 10);
        i.rotateX(Math.PI / 2), this.rightEye = new THREE.Mesh(i, e), this.leftEye = this.rightEye.clone();
        var s = new THREE.Vector3(-40, 10, 60);
        s.normalize(), s.setLength(this.radius), this.rightEye.lookAt(s), this.rightEye.position.copy(s), this.group.add(this.rightEye), (s = new THREE.Vector3(40, 10, 60)).normalize(), s.setLength(this.radius), this.leftEye.lookAt(s), this.leftEye.position.copy(s), this.group.add(this.leftEye)
    }, _createEars: function () {
        var t = this._getEarGeometry(), e = new THREE.MeshBasicMaterial({color: 11184810});
        this.rightEar = new THREE.Mesh(t, e), this.leftEar = new THREE.Mesh(t, e);
        var i = new THREE.Vector3(-50, 70, 0);
        i.normalize(), i.setLength(this.radius), this.rightEar.position.copy(i), this.rightEar.rotation.z = THREE.Math.degToRad(30), this.group.add(this.rightEar), (i = new THREE.Vector3(50, 70, 0)).normalize(), i.setLength(this.radius), this.leftEar.position.copy(i), this.leftEar.rotation.z = THREE.Math.degToRad(-30), this.group.add(this.leftEar)
    }, _getEarGeometry: function () {
        var t = .5 * this.radius, e = .83 * this.radius, i = .5 * this.radius, s = .083 * this.radius,
            o = new THREE.BoxGeometry(t, e, i);
        o.applyMatrix((new THREE.Matrix4).makeTranslation(0, s, 0));
        var r = o.vertices;
        return r[0].x = r[1].x = 10, r[0].z = r[1].z = 10, r[4].x = r[5].x = -10, r[4].z = r[5].z = -10, o.needsUpdate = !0, o
    }, addEventListener: function (t, e) {
        void 0 === this._listeners && (this._listeners = {});
        var i = this._listeners;
        void 0 === i[t] && (i[t] = []), -1 === i[t].indexOf(e) && i[t].push(e)
    }, hasEventListener: function (t, e) {
        if (void 0 === this._listeners) return !1;
        var i = this._listeners;
        return void 0 !== i[t] && -1 !== i[t].indexOf(e)
    }, removeEventListener: function (t, e) {
        if (void 0 !== this._listeners) {
            var i = this._listeners[t];
            if (void 0 !== i) {
                var s = i.indexOf(e);
                -1 !== s && i.splice(s, 1)
            }
        }
    }, dispatchEvent: function (t) {
        if (void 0 !== this._listeners) {
            var e = this._listeners[t.type];
            if (void 0 !== e) {
                t.target = this;
                for (var i = e.slice(0), s = 0, o = i.length; s < o; s++) i[s].call(this, t)
            }
        }
    }
});
CW.Egg.LegSegment = function (t, i, e, s) {
    THREE.Object3D.call(this), this.width = t, this.height = i, this.depth = e, this.body = new THREE.Mesh(new THREE.BoxBufferGeometry(t, i, e), new THREE.MeshBasicMaterial({
        color: s,
        wireframe: !1
    })), this.body.position.y = -this.height / 2, this.body.castShadow = !0, this.add(this.body), this.pin = new THREE.Mesh(new THREE.SphereBufferGeometry(4, 4, 4), new THREE.MeshBasicMaterial({
        color: s,
        wireframe: !1
    })), this.pin.position.y = 5 - this.height, this.add(this.pin)
}, CW.Egg.LegSegment.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Egg.LegSegment,
    getPinPosition: function () {
        var t = new THREE.Vector3;
        return function () {
            return t.copy(this.pin.position).applyMatrix4(this.matrix)
        }
    }()
}), CW.Egg.Leg = function (t, i, e, s, o) {
    THREE.Object3D.call(this), this.STATE = {
        STAND: "STAND",
        WALK: "WALK",
        RUN: "RUN"
    }, this.isLeft = "left" === s, this.color = o, this.state = this.STATE.STAND, this.cycle = 0, this.cycleValue = CW.Util.random(.03, .1), this.width = t, this.height = i, this.depth = e, this.seg0, this.seg1, this.foot, this._init()
}, CW.Egg.Leg.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Egg.Leg, update: function () {
        this.state === this.STATE.WALK ? (this._updateWalk(this.seg0, this.seg1, this.cycle), this.cycle += this.cycleValue) : this.state === this.STATE.RUN && (this._updateRun(this.seg0, this.seg1, this.cycle), this.cycle += this.cycleValue)
    }, actStand: function () {
        var t = this;
        this.state = this.STATE.STAND, this._killTweens(), TweenLite.to(this.seg0.rotation, .5, {
            x: 0,
            y: 0,
            z: 0,
            onUpdate: function () {
                t.seg0.updateMatrixWorld(), t.seg1.position.copy(t.seg0.getPinPosition())
            }
        }), TweenLite.to(this.seg1.rotation, .5, {
            x: 0, y: 0, z: 0, onUpdate: function () {
                t.seg1.updateMatrixWorld()
            }
        }), TweenLite.to(this.foot.rotation, .5, {
            x: 0, y: 0, z: 0, onUpdate: function () {
                t.seg1.updateMatrixWorld(), t.foot.position.copy(t.seg1.getPinPosition())
            }
        })
    }, actWalk: function () {
        this.state = this.STATE.WALK, this.cycle = 0, this.isLeft && (this.cycle += Math.PI), this._killTweens()
    }, actRun: function () {
        this.state = this.STATE.RUN, this.cycle = 0, this.isLeft && (this.cycle += Math.PI), this._killTweens()
    }, _updateWalk: function (t, i, e) {
        var s = -Math.PI / 2, o = 30 * Math.sin(e), h = 30 * Math.sin(e + s) + 20;
        t.rotation.x = THREE.Math.degToRad(o), i.rotation.x = t.rotation.x + THREE.Math.degToRad(h), t.updateMatrixWorld(), i.position.copy(t.getPinPosition()), i.updateMatrixWorld()
    }, _updateRun: function (t, i, e) {
        var s = -Math.PI / 2, o = 60 * Math.sin(e), h = 45 * Math.sin(e + s) + 45;
        t.rotation.x = THREE.Math.degToRad(o), i.rotation.x = t.rotation.x + THREE.Math.degToRad(h), t.updateMatrixWorld(), i.position.copy(t.getPinPosition()), i.updateMatrixWorld()
    }, _killTweens: function () {
        TweenLite.killTweensOf(this.seg0.rotation), TweenLite.killTweensOf(this.seg1.rotation)
    }, _init: function () {
        this.seg0 = new CW.Egg.LegSegment(this.width, this.height / 2, this.depth, this.color), this.add(this.seg0), this.seg1 = new CW.Egg.LegSegment(this.width, this.height / 2, this.depth, this.color), this.seg1.position.copy(this.seg0.getPinPosition()), this.add(this.seg1), this.seg1.updateMatrixWorld(), this.update()
    }
});
CW.Fish = function (t, e, i, s) {
    THREE.Object3D.call(this), t = t || 0, e = e || 0, i = i || 0, this.position.set(t, e, i), this.acceleration = new THREE.Vector3(0, 0, CW.Util.random(.1, .4)), this.velocity = new THREE.Vector3(0, 0, 1), this.r = 4, this.maxspeed = CW.Util.random(14, 25), this.maxforce = .1, this.numSegments = 4, this.segments = [], this.maxRadius = s || 30, this.cycle = .7 * Math.random(), this.cycleAddValue = .15, this.bodyMaterial = new THREE.MeshBasicMaterial({
        color: 4732756,
        wireframe: !1
    }), this.boundingBox, this.group, this._init()
}, CW.Fish.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Fish, update: function (t) {
        this.velocity.add(this.acceleration), this.velocity.length() > this.maxspeed && this.velocity.setLength(this.maxspeed), this.position.add(this.velocity);
        var e = Math.atan2(this.velocity.x, this.velocity.z);
        this.group.rotation.y;
        this.group.rotation.y = e, this.cycle += this.cycleAddValue;
        for (var i = 0; i < this.numSegments; i++) {
            var s = .9 * -i, o = Math.PI / (20 / (i + 1)), a = Math.sin(this.cycle + s) * o;
            this.segments[i].rotation.y = a
        }
    }, applyForce: function (t) {
        this.acceleration.add(t)
    }, changeColorRed: function () {
        this.bodyMaterial.color.set(16711680)
    }, changeColorOrigin: function () {
        this.bodyMaterial.color.set(4732756)
    }, _init: function () {
        this._createSphere(), this._createBoundingBox()
    }, _createSphere: function () {
        var t = CW.Util.random(this.maxRadius - 20, this.maxRadius), e = t, i = .22 * t;
        this.group = new THREE.Group, this.add(this.group);
        for (var s = this.group, o = 0, a = (new THREE.MeshBasicMaterial({
            color: 3355443,
            wireframe: !1
        }), 0); a < this.numSegments; a++) {
            e = t - a * i, e = Math.max(e, 5);
            var h = new THREE.SphereBufferGeometry(e, 8, 8), n = new THREE.Mesh(h, this.bodyMaterial);
            n.castShadow = !0, n.position.z = o, s.add(n), s = n, o = -e, this.segments.push(s)
        }
        var r = new THREE.Mesh(new THREE.SphereBufferGeometry(.3 * t, 8, 8), new THREE.MeshBasicMaterial({color: 15724527}));
        r.position.z = t - 5, this.group.children[0].add(r)
    }, _createBoundingBox: function () {
        var t = new THREE.Box3;
        t.setFromObject(this), this.boundingBox = new THREE.Mesh(new THREE.BoxBufferGeometry(t.max.x - t.min.x + 50, t.max.y - t.min.y + 50, t.max.z - t.min.z + 50), new THREE.MeshBasicMaterial({
            color: 16711680,
            wireframe: !0,
            visible: !1
        })), this.add(this.boundingBox)
    }
});
CW.Flag = function () {
    THREE.Object3D.call(this), this.numSegments = 8, this.segments = [], this.segWidth = 10, this.segHeight = 140, this.segDepth = 30, this.cycle = 0, this.flagpole, this.cloths, this.height = 700, this._init()
}, CW.Flag.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Flag, update: function () {
        this.cycle += .05;
        for (var t = 0; t < this.numSegments; t++) {
            var s = .9 * -t, e = Math.PI / (30 / (t + 1)), i = Math.sin(this.cycle + s) * e;
            this.segments[t].rotation.y = i
        }
    }, _init: function () {
        this._createCloths(), this._createBar()
    }, _createCloths: function () {
        this.cloths = new THREE.Group, this.cloths.position.y = this.height - 60, this.add(this.cloths);
        var t = new THREE.BoxBufferGeometry(this.segWidth, this.segHeight, this.segDepth);
        t.applyMatrix((new THREE.Matrix4).makeTranslation(0, 0, -this.segDepth / 2));
        for (var s = this.cloths, e = 0, i = new THREE.MeshBasicMaterial({
            color: 16711680,
            wireframe: !1
        }), a = 0; a < this.numSegments; a++) {
            var h = 1.1 - .1 * a, o = t.clone();
            o.applyMatrix((new THREE.Matrix4).makeScale(1, h, 1));
            var r = new THREE.Mesh(o, i);
            r.position.z = e, s.add(r), s = r, e = 2 - this.segDepth, this.segments.push(s)
        }
    }, _createBar: function () {
        this.flagpole = new THREE.Group, this.add(this.flagpole);
        var t = new THREE.BoxBufferGeometry(1, 1, 1);
        t.applyMatrix((new THREE.Matrix4).makeTranslation(0, .5, 0)), this.barBottom = new THREE.Mesh(t, CW.Util.getGrayBasicMaterial()), this.barBottom.castShadow = !0, this.barBottom.scale.set(20, 20, 20), this.flagpole.add(this.barBottom), this.bar = new THREE.Mesh(t, CW.Util.getGrayBasicMaterial()), this.bar.castShadow = !0, this.bar.scale.set(10, this.height, 10), this.bar.position.set(0, 10, 0), this.flagpole.add(this.bar), this.barTop = new THREE.Mesh(t, CW.Util.getGrayBasicMaterial()), this.barTop.castShadow = !0, this.barTop.scale.set(20, 20, 20), this.barTop.position.set(0, this.height, 0), this.flagpole.add(this.barTop)
    }
});
CW.FloatingIsland = function (t, e, i) {
    THREE.Object3D.call(this), this.STATE = {
        HIDE: "HIDE",
        SHOW_LAND: "SHOW_LAND",
        SHOW_ROCKS: "SHOW_ROCKS",
        FLOAT: "FLOAT"
    }, this.state = this.STATE.HIDE, this.width = t, this.depth = e, this.resolution = i, this.planets = [], this.rocks = [], this.stones = [], this.fires = [], this.cover, this.boundingBox, this._init()
}, CW.FloatingIsland.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.FloatingIsland, update: function () {
        CW.Util.forEach(this.rocks, function (t, e) {
            t.rotation.y += t._acceleration, t._radian += t._acceleration, t.position.x = Math.cos(t._radian) * t._radius, t.position.z = Math.sin(t._radian) * t._radius
        }), CW.Util.forEach(this.stones, function (t, e) {
            t.rotation.y += t._acceleration, t._radian += t._acceleration, t.position.x = Math.cos(t._radian) * t._radius, t.position.z = Math.sin(t._radian) * t._radius
        }), CW.Util.forEach(this.fires, function (t, e) {
            t.rotation.y += t._acceleration, t.rotation.x += t._acceleration, t._radian += t._acceleration, t.position.y -= t._accelPosY;
            var i = Math.max(.3, t.scale.x - .3);
            if (t.scale.set(i, i, i), .3 === t.scale.x) {
                t.position.y = -300;
                i = CW.Util.random(50, 100);
                t.scale.set(i, i, i)
            }
        }), CW.Util.forEach(this.planets, function (t) {
            t._radian += t._accel, t.position.x = Math.cos(t._radian) * t._radius, t.position.y = Math.sin(t._radian / 2) * t._radius
        })
    }, floatALittle: function () {
        var t = this, e = {color: CW.RainyFloor.finalColor};
        TweenLite.to(e, 1, {
            color: "#4d3d58", onUpdate: function () {
                t.plane.material.color.set(e.color)
            }
        })
    }, show: function (t) {
        var e = this;
        this._showPlane(function () {
            e._showRocks(), TweenLite.delayedCall(.5, function () {
                e._showStones()
            }), TweenLite.delayedCall(1, function () {
                e._showFires(), e._showPlanets()
            }), TweenLite.delayedCall(1.5, function () {
                t && t()
            })
        })
    }, sink: function (t) {
        this._sinkPlanets(), this.cover.visible = !0, this.cover.position.y = -1e3, TweenLite.to(this.cover.position, 3, {
            y: -20,
            ease: Power2.easeInOut,
            onComplete: function () {
                t && t()
            }
        }), CW.Util.forEach(this.fires, function (t, e) {
            TweenLite.to(t.material, .6, {delay: .03 * e, opacity: 0})
        })
    }, hide: function (t) {
        TweenLite.to(this.plane.position, 2, {
            y: -25, ease: Sine.easeInOut, onComplete: function () {
                t && t()
            }
        })
    }, _sinkPlanets: function () {
        CW.Util.forEach(this.planets, function (t, e) {
            TweenLite.set(t, {delay: .03 * e, visible: !1})
        })
    }, _showPlane: function (t) {
        var n = this._getLandVerticesData(), o = this.plane.geometry.vertices, s = .01 * n.length;
        CW.Util.forEach(n, function (t, e) {
            var i = o[t._index], a = n[e];
            i._origin = a._origin, TweenLite.to(i, 1, {
                delay: s - .01 * e,
                x: a.x,
                y: a.y,
                z: a.z,
                ease: Power3.easeInOut
            })
        });
        var e = this;
        TweenLite.to({a: 0}, .6 + s, {
            a: 10, onUpdate: function () {
                e.plane.geometry.elementsNeedUpdate = !0, e.plane.geometry.verticesNeedUpdate = !0
            }
        }), TweenLite.delayedCall(.5, function () {
            t && t()
        })
    }, _showRocks: function () {
        var i = 0;
        CW.Util.forEach(this.rocks, function (t, e) {
            i = .01 * e, t.visible = !0, TweenLite.to(t.scale, .6, {
                delay: i,
                x: t._scaleX,
                z: t._scaleZ,
                ease: Back.easeInOut
            }), TweenLite.to(t.scale, .6, {
                delay: i + .3,
                y: t._scaleY,
                z: t._scaleZ,
                ease: Back.easeInOut
            }), TweenLite.to(t.position, .5, {delay: i, x: t._posX, y: t._posY, z: t._posZ, ease: Back.easeInOut})
        })
    }, _showStones: function (t) {
        var i = 0;
        CW.Util.forEach(this.stones, function (t, e) {
            i = .01 * e, t.visible = !0, TweenLite.to(t.scale, .6, {
                delay: i,
                x: t._scaleX,
                z: t._scaleZ,
                ease: Back.easeInOut
            }), TweenLite.to(t.scale, .6, {delay: i + .3, y: t._scaleY, z: t._scaleZ, ease: Back.easeInOut})
        })
    }, _showFires: function () {
        CW.Util.forEach(this.fires, function (t, e) {
            TweenLite.set(t, {delay: .03 * e, visible: !0})
        })
    }, _showPlanets: function () {
        CW.Util.forEach(this.planets, function (t, e) {
            TweenLite.set(t, {delay: .03 * e, visible: !0})
        })
    }, _init: function () {
        this._createPlane(), this._createRocks(), this._createStones(), this._createFires(), this._createPlanets(), this._createCover(), this._createBoundingBox()
    }, _createPlane: function () {
        this.plane = new THREE.Mesh(new THREE.PlaneGeometry(500, 500, 8, 8).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({
            color: CW.RainyFloor.finalColor,
            side: THREE.DoubleSide
        })), this.add(this.plane)
    }, _createRocks: function () {
        var t, e, i = new THREE.BoxGeometry(1, 1, 1);
        i.applyMatrix((new THREE.Matrix4).makeTranslation(0, -.5, 0));
        for (var a = 0; a < 50; a++) {
            1, e = new THREE.MeshBasicMaterial({color: CW.Util.getColorRgb("#6c567b", "#c06c84", a / 50)}), t = i.clone(), CW.Util.forEach(t.vertices, function (t, e) {
                t.x += CW.Util.random(-.2, .2), t.y += CW.Util.random(-.1, .1), t.z += CW.Util.random(-.2, .2)
            });
            var n = new THREE.Mesh(t, e);
            n._radian = CW.Util.random(0, 2 * Math.PI), n._radius = CW.Util.random(100 - a / 3, 250 - a / 3), n._scaleX = CW.Util.random(30, 120), n._scaleY = CW.Util.random(150, 300), n._scaleZ = CW.Util.random(30, 120), n._posX = Math.cos(n._radian) * n._radius, n._posZ = Math.sin(n._radian) * n._radius, n._posY = -200 - 3 * a, n.scale.set(1, 1, 1), n.position.x = 0, n.position.z = 0, n.position.y = -500, n._acceleration = CW.Util.random(.001, .005), .5 < CW.Util.random(0, 1) && (n._acceleration *= -1), n.visible = !1, this.rocks.push(n), this.add(n)
        }
    }, _createStones: function () {
        var t = new THREE.BoxBufferGeometry(1, 1, 1);
        t.applyMatrix((new THREE.Matrix4).makeTranslation(0, -.5, 0));
        for (var e = 0; e < 30; e++) {
            var i = new THREE.MeshBasicMaterial({color: CW.Util.getColorRgb("#c06c84", "#f67280", e / 30)}),
                a = new THREE.Mesh(t, i);
            a.scale.set(1, 1, 1), a._radian = CW.Util.random(0, 2 * Math.PI), a._radius = CW.Util.random(50 - e / 3, 140 - e / 3), a.position.x = Math.cos(a._radian) * a._radius, a.position.z = Math.sin(a._radian) * a._radius, a.position.y = -400 - 7 * e, a._scaleX = CW.Util.random(20, 70), a._scaleY = CW.Util.random(40, 150), a._scaleZ = CW.Util.random(20, 70), a._acceleration = CW.Util.random(.001, .005), .5 < CW.Util.random(0, 1) && (a._acceleration *= -1), a.visible = !1, this.stones.push(a), this.add(a)
        }
    }, _createFires: function () {
        var t = new THREE.BoxBufferGeometry(1, 1, 1);
        t.applyMatrix((new THREE.Matrix4).makeTranslation(0, 0, 0));
        for (var e = 0; e < 20; e++) {
            var i = CW.Util.getColorRgb("#f67280", "#f8b195", e / 20),
                a = new THREE.MeshBasicMaterial({color: i, transparent: !0, opacity: 1}), n = new THREE.Mesh(t, a),
                o = CW.Util.random(50, 70);
            n.scale.set(o, o, o);
            var s = CW.Util.random(0, 2 * Math.PI), r = CW.Util.random(20, 170);
            n.position.x = Math.cos(s) * r, n.position.z = Math.sin(s) * r, n.rotation.y = s, n.position.y = -300, n._accelPosY = CW.Util.random(4, 10), n._acceleration = CW.Util.random(.02, .05), .5 < CW.Util.random(0, 1) && (n._acceleration *= -1), n._radian = s, n._radius = r, n.visible = !1, this.fires.push(n), this.add(n)
        }
    }, _createPlanets: function () {
        for (var t, e = new THREE.BoxBufferGeometry(1, 1, 1), i = 0; i < 5; i++) {
            t = new THREE.Mesh(e, CW.Util.getGrayMaterial());
            var a = CW.Util.random(5, 20);
            t.scale.set(a, a, a), t._radian = CW.Util.random(0, 2 * Math.PI), t._radius = CW.Util.random(600, 1500), t._accel = CW.Util.random(.01, .04), t.position.x = Math.cos(t._radian) * t._radius, t.position.z = Math.sin(t._radian) * t._radius, t.position.y = CW.Util.random(-50, 50), t.visible = !1, this.add(t), this.planets.push(t)
        }
    }, _createCover: function () {
        var t = new THREE.BoxBufferGeometry(800, 1500, 800);
        t.applyMatrix((new THREE.Matrix4).makeTranslation(0, -750, 0)), this.cover = new THREE.Mesh(t, new THREE.MeshBasicMaterial({color: CW.SceneFloatingIsland.sceneColor})), this.cover.position.y = -1500, this.cover.visible = !1, this.add(this.cover)
    }, _createBoundingBox: function () {
        this.boundingBox = new THREE.Mesh(new THREE.BoxBufferGeometry(700, 1e3, 700), new THREE.MeshBasicMaterial({
            color: 16711680,
            visible: !1
        })), this.boundingBox.position.y = -500, this.add(this.boundingBox)
    }, _getLandVerticesData: function () {
        var t = this._addDistInfo(this.plane.geometry.vertices.slice());
        return this._sortByDist(t), this._makeLand(t), t
    }, _addDistInfo: function (t) {
        for (var e = [], i = 0; i < t.length; i++) {
            var a = t[i].clone();
            a._index = i;
            var n = Math.sqrt(a.x * a.x + a.z * a.z);
            a.dist = n, a._origin = {x: a.x, y: a.y, z: a.z}, e.push(a)
        }
        return e
    }, _sortByDist: function (t) {
        t.sort(function (t, e) {
            var i = 0;
            return t.dist > e.dist ? i = 1 : t.dist < e.dist && (i = -1), i
        })
    }, _makeLand: function (i) {
        var a = 0;
        CW.Util.forEach(i, function (t, e) {
            t.dist < 120 ? (a += 2, t.y = 0) : (a += 5, t.y -= a), e > i.length - 20 ? (t.x += -t.x / 5, t.z += -t.z / 5) : (t.x += CW.Util.random(-30, 30), t.z += CW.Util.random(-30, 30))
        })
    }
});
CW.FlowFieldSea = function (t, i, s) {
    THREE.Object3D.call(this), this.colors = [{firstColor: "#00f260", finalColor: "#0575e6"}, {
        firstColor: "#BE93C5",
        finalColor: "#7BC6CC"
    }, {firstColor: "#DAD299", finalColor: "#B0DAB9"}, {
        firstColor: "#fffc00",
        finalColor: "#ffffff"
    }, {firstColor: "#feac5e", finalColor: "#c779d0"}, {
        firstColor: "#ec008c",
        finalColor: "#fc6767"
    }, {firstColor: "#79cbca", finalColor: "#e684ae"}, {
        firstColor: "#ff512f",
        finalColor: "#dd2476"
    }, {
        firstColor: "#1a2980",
        finalColor: "#26d0ce"
    }], this.width = t, this.depth = i, this.resolution = s, this.cols = this.width / this.resolution, this.rows = this.depth / this.resolution, this.field = this.make2Darray(this.cols), this.groups = this.make2Darray(this.cols), this.groupContainer, this.boundingBox, this.cycle = 0, this.timer = 0, this.perlin_octaves = 4, this.perlin_amp_falloff = .5, this.perlin, this.PERLIN_YWRAPB = 4, this.PERLIN_YWRAP = 1 << this.PERLIN_YWRAPB, this.PERLIN_ZWRAPB = 8, this.PERLIN_ZWRAP = 1 << this.PERLIN_ZWRAPB, this.PERLIN_SIZE = 4095, this._init(), this.reset()
}, CW.FlowFieldSea.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.FlowFieldSea, update: function () {
        this.timer += 1, 60 <= this.timer && (this.reset(), this.timer = 0)
    }, make2Darray: function (t) {
        for (var i = [], s = 0; s < t; s++) i[s] = [];
        return i
    }, lookup: function (t) {
        var i = Math.floor(constrain(t.x / this.resolution, 0, this.cols - 1)),
            s = Math.floor(constrain(t.z / this.resolution, 0, this.rows - 1));
        return this.field[i][s].clone()
    }, reset: function () {
        this.noiseSeed(Math.floor(CW.Util.random(0, 1e4)));
        for (var t = CW.Util.randomFloor(0, this.colors.length), i = this.colors[t].firstColor, s = this.colors[t].finalColor, o = 0, e = 0; e < this.cols; e++) {
            for (var r = 0, n = 0; n < this.rows; n++) {
                var h = CW.Util.map(this.noise(o, r), 0, 1, 0, 2 * Math.PI);
                this.field[e][n].set(Math.cos(h), 0, Math.sin(h)), r += .1
            }
            o += .1
        }
        var a = 0;
        for (e = 0; e < this.cols; e++) for (n = 0; n < this.rows; n++) {
            var l = this.groups[e][n], c = l._idx / (this.cols * this.rows), f = CW.Util.getColorFromGradient(i, s, c),
                d = (CW.Util.getColorRgb(i, s, c), this.field[e][n]), E = Math.atan2(d.x, d.z),
                u = 50 * E + 50 * Math.PI;
            2.3 < E && (u = 10), u *= 3, a = Math.max(u, a);
            var R = (e + n) / (this.cols + this.rows);
            l._scaleY = u, l._enabled && (TweenLite.delayedCall(R, function () {
                TweenLite.killTweensOf(l.rotation), TweenLite.killTweensOf(l.scale), TweenLite.killTweensOf(l.children[0].material.color)
            }), TweenLite.to(l.rotation, 1, {delay: R, y: E, ease: Back.easeInOut}), TweenLite.to(l.scale, 1, {
                delay: R,
                y: u,
                ease: Back.easeInOut
            }), TweenLite.to(l.children[0].material.color, 1, {
                delay: R,
                r: f[0] / 255,
                g: f[1] / 255,
                b: f[2] / 255,
                ease: Back.easeInOut
            }))
        }
    }, _init: function () {
        for (var t = 0, i = 0; i < this.cols; i++) {
            for (var s = 0, o = 0; o < this.rows; o++) {
                var e = CW.Util.map(this.noise(t, s), 0, 1, 0, 2 * Math.PI);
                this.field[i][o] = new THREE.Vector3(Math.cos(e), 0, Math.sin(e)), s += .1
            }
            t += .1
        }
        this._create()
    }, _create: function () {
        this._createGroupContainer(), this._createBoxes(), this._createBoundingBox()
    }, _createGroupContainer: function () {
        this.groupContainer = new THREE.Group, this.groupContainer.position.set(-this.width / 2, 0, -this.depth / 2), this.add(this.groupContainer)
    }, _createBoxes: function () {
        var t = new THREE.Vector3(this.width / 2, 0, this.depth / 2), i = new THREE.BoxBufferGeometry(80, 1, 40);
        i.applyMatrix((new THREE.Matrix4).makeTranslation(0, .5, 0));
        for (var s = 0, o = 0; o < this.cols; o++) for (var e = 0; e < this.rows; e++) {
            var r = this.field[o][e], n = o * this.resolution, h = e * this.resolution,
                a = (this.resolution, new THREE.Group), l = (s += 1) / (this.cols * this.rows),
                c = CW.Util.getColorRgb("#006DAB", "#2C8CAB", l), f = new THREE.MeshBasicMaterial({color: c}),
                d = new THREE.Mesh(i, f);
            d.castShadow = !0, a.add(d);
            var E = Math.atan2(r.x, r.z);
            a.rotation.y = E, a._cycle = 2 * Math.random();
            var u = CW.Util.distance(n, h, t.x, t.z);
            u > this.width / 2 - 50 && (a.visible = !1), a._idx = s, a._enabled = !(u < 350), a.position.set(n, 0, h), this.groupContainer.add(a), this.groups[o][e] = a
        }
    }, _createBoundingBox: function () {
        this.boundingBox = new THREE.Mesh(new THREE.BoxBufferGeometry(this.width, 500, this.depth), new THREE.MeshBasicMaterial({
            color: 16711680,
            visible: !1
        })), this.boundingBox.position.y = 250, this.add(this.boundingBox)
    }, scaled_cosine: function (t) {
        return .5 * (1 - Math.cos(t * Math.PI))
    }, noiseSeed: function (t) {
        var i, s, o, e = (o = 4294967296, {
            setSeed: function (t) {
                s = i = (null == t ? Math.random() * o : t) >>> 0
            }, getSeed: function () {
                return i
            }, rand: function () {
                return (s = (1664525 * s + 1013904223) % o) / o
            }
        });
        e.setSeed(t), this.perlin = new Array(this.PERLIN_SIZE + 1);
        for (var r = 0; r < this.PERLIN_SIZE + 1; r++) this.perlin[r] = e.rand()
    }, noise: function (t, i, s) {
        if (i = i || 0, s = s || 0, null == this.perlin) {
            this.perlin = new Array(this.PERLIN_SIZE + 1);
            for (var o = 0; o < this.PERLIN_SIZE + 1; o++) this.perlin[o] = Math.random()
        }
        t < 0 && (t = -t), i < 0 && (i = -i), s < 0 && (s = -s);
        for (var e, r, n, h, a, l = Math.floor(t), c = Math.floor(i), f = Math.floor(s), d = t - l, E = i - c, u = s - f, R = 0, _ = .5, p = 0; p < this.perlin_octaves; p++) {
            var C = l + (c << this.PERLIN_YWRAPB) + (f << this.PERLIN_ZWRAPB);
            e = this.scaled_cosine(d), r = this.scaled_cosine(E), n = this.perlin[C & this.PERLIN_SIZE], n += e * (this.perlin[C + 1 & this.PERLIN_SIZE] - n), h = this.perlin[C + this.PERLIN_YWRAP & this.PERLIN_SIZE], n += r * ((h += e * (this.perlin[C + this.PERLIN_YWRAP + 1 & this.PERLIN_SIZE] - h)) - n), C += this.PERLIN_ZWRAP, h = this.perlin[C & this.PERLIN_SIZE], h += e * (this.perlin[C + 1 & this.PERLIN_SIZE] - h), a = this.perlin[C + this.PERLIN_YWRAP & this.PERLIN_SIZE], h += r * ((a += e * (this.perlin[C + this.PERLIN_YWRAP + 1 & this.PERLIN_SIZE] - a)) - h), R += (n += this.scaled_cosine(u) * (h - n)) * _, _ *= this.perlin_amp_falloff, l <<= 1, c <<= 1, f <<= 1, 1 <= (d *= 2) && (l++, d--), 1 <= (E *= 2) && (c++, E--), 1 <= (u *= 2) && (f++, u--)
        }
        return R
    }
});
CW.Ghost = function (e, i, t) {
    THREE.Object3D.call(this), this.path = e, this.firstColor = i || "#ec2F4B", this.finalColor = t || "#009FFF", this.curve, this.rings = [], this.boxes = [], this.isUpdate = !1, this._init()
}, CW.Ghost.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Ghost, show: function (e) {
        var i = this, t = .05 * this.rings.length + .02 * this.rings[0].innerGroup.children.length + .3;
        CW.Util.forEach(this.rings, function (e, i) {
            for (var t = .05 * i, s = e.innerGroup.children, n = 0; n < s.length; n++) {
                var a = s[n];
                TweenLite.set(a, {delay: t + .01 * n, visible: !0}), TweenLite.to(a.scale, .3, {
                    delay: t + .02 * n,
                    x: a._scale.x,
                    y: a._scale.y,
                    z: a._scale.z,
                    ease: Back.easeInOut
                })
            }
        }), t -= .5, TweenLite.set(this.face, {delay: t, visible: !0}), TweenLite.set(this.nose, {
            delay: t,
            visible: !0
        }), TweenLite.to(this.face.scale, .4, {
            delay: t,
            x: 1,
            y: 1,
            z: 1,
            ease: Power3.easeInOut
        }), TweenLite.to(this.nose.scale, .4, {
            delay: t + .1,
            x: 1,
            y: 1,
            z: 1,
            ease: Power3.easeInOut
        }), TweenLite.delayedCall(t, function () {
            e && e(), i.isUpdate = !0
        })
    }, crumple: function (n, a, e) {
        var i = this;
        this.isUpdate = !1, CW.Util.sceneDetach(this.face, this.face.parent, a.scene), TweenLite.to(this.face.position, 1, {
            y: -300,
            ease: Power2.easeInOut,
            onComplete: function () {
                a.scene.remove(i.face)
            }
        });
        var r = 0;
        CW.Util.forEach(this.rings, function (e, i) {
            for (var t = e.innerGroup.children.length - 1; 0 <= t; t--) {
                var s = e.innerGroup.children[t];
                CW.Util.sceneDetach(s, e.innerGroup, a.scene), r = .05 * i + .02 * t, TweenLite.to(s.position, 2, {
                    delay: r,
                    x: n.x,
                    y: n.y,
                    z: n.z,
                    ease: Elastic.easeOut.config(1, .3)
                }), TweenLite.to(s.scale, 2, {
                    delay: r,
                    x: s.scale.x / 2,
                    y: s.scale.y / 2,
                    z: s.scale.z / 2,
                    ease: Circ.easeInOut
                }), TweenLite.to(s.rotation, 4, {delay: r, x: Math.random() * Math.PI * 2, ease: Bounce.easeInOut})
            }
        }), TweenLite.delayedCall(r + 2, function () {
            e && e()
        })
    }, sink: function (t, e) {
        var i = this, a = 0, r = new THREE.Vector3;
        CW.Util.forEach(this.boxes, function (e, i) {
            a += .05;
            var t = CW.Util.randomFloor(30, 150), s = e.position.x + Math.cos(a) * t,
                n = e.position.z + Math.sin(a) * t;
            r.set(s, e.position.y + 100, n), TweenLite.to(e.position, 6.1, {
                delay: 0,
                y: -300,
                ease: Sine.easeInOut
            }), TweenLite.to(e.position, 6, {delay: .3, x: s, z: n, ease: Sine.easeInOut})
        }), TweenLite.delayedCall(6.3, function () {
            CW.Util.forEach(i.boxes, function (e, i) {
                t.scene.remove(e)
            }), i.boxes = null, e && e()
        })
    }, update: function () {
        this.isUpdate && this._updateRings()
    }, _updateRings: function () {
        for (var e, i = 0, t = this.rings.length; i < t; i++) {
            (e = this.rings[i])._index += .3, e._index >= e._length && (e._index = 0);
            var s = this.curve.getPoint(e._index / e._length), n = this.curve.getPoint((e._index + 1) / e._length);
            e.position.copy(s), e.lookAt(n), e.children[0].rotation.y += e.children[0]._rotateY, e.radius >= e.radiusMax ? (e.radius = e.radiusMax - 1, e.radiusAddValue *= -1) : e.radius <= e.radiusMin && (e.radius = e.radiusMin + 1, e.radiusAddValue *= -1), e.radius += e.radiusAddValue;
            for (var a = 0, r = e.children[0].children.length; a < r; a++) {
                var o = e.innerGroup.children[a];
                (s = new THREE.Vector3).x = Math.cos(o._rad) * e.radius + o._radiusAdd, s.z = Math.sin(o._rad) * e.radius + o._radiusAdd, o.position.copy(s)
            }
        }
    }, _init: function () {
        this._createCurve(), this._createRings(), this._createBoxesInRings(), this._createFace(), this._updateRings()
    }, _createCurve: function () {
        this.curve = new THREE.CatmullRomCurve3(this.path, !0);
        var e = this.curve.getPoints(50);
        (new THREE.BufferGeometry).setFromPoints(e), new THREE.LineBasicMaterial({color: 0})
    }, _createRings: function () {
        Math.floor(CW.Util.random(20, 90));
        for (var e = 0; e < 26; e++) {
            var i = this.curve.getPoint(e / 26), t = new THREE.Group;
            t._index = e + 50, t._length = 100, t.position.copy(i), t.defaultRadius = CW.Util.random(10, 40), t.radius = t.defaultRadius + e, t.radiusMax = t.defaultRadius + 80, t.radiusMin = t.defaultRadius + 10, t.radiusAddValue = 1.4, t.innerGroup = new THREE.Group, t.innerGroup.rotateX(Math.PI / 2), t.innerGroup._rotateY = CW.Util.random(.02, .05), t.add(t.innerGroup), this.add(t), this.rings.push(t)
        }
    }, _createBoxesInRings: function () {
        for (var e, i, t = new THREE.BoxBufferGeometry(1, 1, 1), s = new THREE.Vector3, n = 0; n < this.rings.length; n++) {
            e = (i = this.rings[n]).innerGroup;
            for (var a = i.radius, r = (Math.floor(CW.Util.random(50, 150)), new THREE.MeshBasicMaterial({color: CW.Util.getColorRgb(this.firstColor, this.finalColor, n / this.rings.length)})), o = 0; o < 8; o++) {
                var h = o / 8 * 360 + 10 * n, c = CW.Util.degToRad(h), l = new THREE.Vector3;
                l.x = Math.cos(c) * a, l.z = Math.sin(c) * a;
                var d = new THREE.Mesh(t, r);
                d._scale = {
                    x: CW.Util.random(80, 130),
                    y: CW.Util.random(150, 500),
                    z: CW.Util.random(80, 130)
                }, d.scale.set(1, 1, 1), d.position.copy(s), d.lookAt(l), d.position.copy(l), d.castShadow = !0, d.visible = !1, d._rad = c, d._radiusAdd = CW.Util.random(-20, 20), e.add(d), this.boxes.push(d)
            }
            var u = this.curve.getPoint((n + 1) / i._length);
            i.lookAt(u)
        }
    }, _createFace: function () {
        this.face = new THREE.Mesh(new THREE.SphereBufferGeometry(100, 8, 8), new THREE.MeshBasicMaterial({
            color: 3355443,
            wireframe: !1
        }));
        var e = new THREE.BoxGeometry(30, 60, 30), i = e.vertices;
        i[0].x = i[1].x -= 10, i[4].x = i[5].x += 10, i[0].z = i[5].z -= 10, i[1].z = i[4].z += 10, e.rotateX(Math.PI / 2), this.nose = new THREE.Mesh(e, new THREE.MeshLambertMaterial({
            color: 3355443,
            wireframe: !1
        })), this.face.scale.set(.1, .1, .1), this.nose.scale.set(.1, .1, .1), this.face.visible = !1, this.nose.visible = !1, this.face.position.z = 200, this.nose.position.z = 130, this.rings[this.rings.length - 1].add(this.face), this.face.add(this.nose), this.mask = new THREE.Mesh(new THREE.SphereBufferGeometry(60, 8, 8), new THREE.MeshBasicMaterial({
            color: 14540253,
            wireframe: !1
        })), this.mask.position.z = 60, this.face.add(this.mask)
    }
});
CW.Giant = function () {
    THREE.Object3D.call(this), this.lookAtTarget = null, this.headGroup, this.head, this.face, this.nose, this.horn, this.neckGroup, this.neckSegments = [], this.bodyGroup, this.bodySegments = [], this.leftArmGroup, this.leftArmSegments = [], this.rightArmGroup, this.rightArmSegments = [], this.boundingBox, this.cycle = 0, this._init()
}, CW.Giant.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Giant, update: function () {
        for (var e, t = 1; t < this.bodySegments.length; t++) (e = this.bodySegments[t]).rotation.x = .01 * Math.sin(this.cycle), e.rotation.y = .01 * Math.sin(this.cycle);
        this.position.y = 50 * Math.cos(this.cycle) - 3e3;
        for (t = 1; t < this.neckSegments.length; t++) (e = this.neckSegments[t]).rotation.z = .14 * Math.sin(this.cycle + .1);
        if (this.cycle += .02, this.lookAtTarget) {
            var i = this.position.x - this.lookAtTarget.position.x, o = this.position.z - this.lookAtTarget.position.z,
                n = Math.atan2(-o, i);
            this.headGroup.rotation.y = this.headGroup.rotation.y + .02 * (n - this.headGroup.rotation.y)
        }
    }, come: function (e) {
        TweenLite.killTweensOf(this.position), TweenLite.killTweensOf(this.rotation), TweenLite.to(this.position, 8, {
            x: 3e3,
            ease: Sine.easeOut
        });
        var t = new TimelineLite;
        t.to(this.rotation, 1.5, {
            y: CW.Util.degToRad(-100),
            ease: Sine.easeInOut
        }), t.to(this.rotation, 1.5, {
            y: CW.Util.degToRad(-80),
            ease: Sine.easeInOut
        }), t.to(this.rotation, 1.5, {
            y: CW.Util.degToRad(-100),
            ease: Sine.easeInOut
        }), t.to(this.rotation, 1.5, {
            y: CW.Util.degToRad(-80),
            ease: Sine.easeInOut
        }), t.to(this.rotation, 2, {
            y: CW.Util.degToRad(-90), ease: Sine.easeInOut, onComplete: function () {
                e && e()
            }
        })
    }, leave: function (e) {
        TweenLite.killTweensOf(this.position), TweenLite.killTweensOf(this.rotation), TweenLite.to(this.rotation, 3, {
            y: CW.Util.degToRad(90),
            ease: Sine.easeInOut
        }), TweenLite.to(this.position, 7, {
            x: 6e3, ease: Sine.easeInOut, onComplete: function () {
                e && e()
            }
        })
    }, setLookAtTarget: function (e) {
        this.lookAtTarget = e
    }, raiseLeftArm: function (e) {
        var t = this.leftArmSegments[0], i = this.leftArmSegments[1];
        TweenLite.to(t.rotation, 1.5, {
            x: CW.Util.degToRad(-13),
            y: CW.Util.degToRad(-30),
            ease: Power1.easeInOut
        }), TweenLite.to(i.rotation, 3, {
            x: CW.Util.degToRad(-117),
            ease: Sine.easeInOut
        }), TweenLite.delayedCall(2.9, function () {
            e && e()
        })
    }, dispose: function () {
        this.lookAtTarget = null
    }, _init: function () {
        this._create()
    }, _create: function () {
        this._createBody(), this._createNeck(), this._createHead(), this._createLeftArm(), this._createRightArm(), this._createBoundingBox()
    }, _createBody: function () {
        var e = [{rTop: 1e3, rBot: 800, height: 700, y: 0}, {rTop: 1800, rBot: 1100, height: 800, y: 650}, {
            rTop: 2100,
            rBot: 1900,
            height: 1e3,
            y: 750
        }, {rTop: 2e3, rBot: 2200, height: 500, y: 950}, {rTop: 800, rBot: 1500, height: 300, y: 450}, {
            rTop: 500,
            rBot: 600,
            height: 200,
            y: 250
        }];
        this.bodyGroup = new THREE.Group, this.add(this.bodyGroup);
        for (var t = this.bodyGroup, i = new THREE.MeshBasicMaterial({color: 2236962}), o = 0; o < e.length; o++) {
            var n = e[o], r = new THREE.CylinderBufferGeometry(n.rTop, n.rBot, n.height, 10);
            r.applyMatrix((new THREE.Matrix4).makeTranslation(0, n.height / 2, 0));
            var s = new THREE.Mesh(r, i);
            s.scale.z = .6;
            var h = new THREE.Group;
            h.position.y = n.y, h.rotation.x = .05, h.add(s), this.bodySegments.push(h), t.add(h), t = h
        }
    }, _createNeck: function () {
        this.neckGroup = new THREE.Group, this.neckGroup.position.y = 150, this.bodySegments[this.bodySegments.length - 1].add(this.neckGroup);
        for (var e = this.neckGroup, t = 120, i = 130, o = new THREE.MeshBasicMaterial({color: 3355443}), n = 0; n < 3; n++) {
            var r = new THREE.CylinderBufferGeometry(t, i, 140, 6);
            r.applyMatrix((new THREE.Matrix4).makeTranslation(0, 70, 0));
            var s = new THREE.Mesh(r, o);
            s.position.y = 0 == n ? 0 : 120, s.rotation.x = .14, this.neckSegments.push(s), e.add(s), e = s, t -= 20, i -= 20
        }
    }, _createHead: function () {
        this.headGroup = new THREE.Group, this.headGroup.position.y = 120, this.neckSegments[this.neckSegments.length - 1].add(this.headGroup), this.head = new THREE.Mesh(new THREE.SphereBufferGeometry(500, 8, 8), new THREE.MeshBasicMaterial({color: 3355443})), this.head.position.y = 500, this.headGroup.add(this.head), this.horn = new THREE.Mesh(new THREE.ConeBufferGeometry(300, 1500, 32), new THREE.MeshBasicMaterial({color: 1118481})), this.horn.position.y = 500, this.head.add(this.horn), this.face = new THREE.Mesh(new THREE.SphereBufferGeometry(300, 8, 8), new THREE.MeshBasicMaterial({color: 11184810})), this.face.scale.y = 1.2, this.face.scale.z = .8, this.face.position.z = 300, this.head.add(this.face), this.nose = new THREE.Mesh(new THREE.BoxBufferGeometry(60, 300, 400), new THREE.MeshBasicMaterial({color: 3355443})), this.nose.position.set(0, -30, 120.5), this.nose.rotation.x = -.65, this.face.add(this.nose), this.head.rotation.x = .3
    }, _createLeftArm: function () {
        var e = [{rTop: 150, rBot: 200, height: 2800, y: 0}, {rTop: 300, rBot: 450, height: 3500, y: -2600}, {
            rTop: 430,
            rBot: 400,
            height: 300,
            y: -3400
        }, {rTop: 380, rBot: 320, height: 300, y: -200}, {rTop: 300, rBot: 200, height: 400, y: -200}, {
            rTop: 170,
            rBot: 80,
            height: 300,
            y: -340
        }];
        this.leftArmGroup = new THREE.Group, this.leftArmGroup.position.x = 2100, this.bodySegments[this.bodySegments.length - 3].add(this.leftArmGroup);
        var t = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(700, 0), new THREE.MeshBasicMaterial({color: 2236962}));
        this.leftArmGroup.add(t);
        for (var i = t, o = new THREE.MeshBasicMaterial({color: 3355443}), n = 0; n < e.length; n++) {
            var r = e[n], s = new THREE.CylinderBufferGeometry(r.rTop, r.rBot, r.height, 8);
            s.applyMatrix((new THREE.Matrix4).makeTranslation(0, -r.height / 2, 0));
            var h = new THREE.Mesh(s, o);
            h.position.y = r.y, h.rotation.x = -.05 * n, this.leftArmSegments.push(h), i.add(h), i = h
        }
    }, _createRightArm: function () {
        var e = [{rTop: 150, rBot: 200, height: 2800, y: 0}, {rTop: 300, rBot: 350, height: 3500, y: -2600}, {
            rTop: 430,
            rBot: 150,
            height: 800,
            y: -3200
        }];
        this.rightArmGroup = new THREE.Group, this.rightArmGroup.position.x = -2100, this.bodySegments[this.bodySegments.length - 3].add(this.rightArmGroup);
        var t = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(700, 0), new THREE.MeshBasicMaterial({color: 2236962}));
        this.rightArmGroup.add(t);
        for (var i = t, o = new THREE.MeshBasicMaterial({color: 3355443}), n = 0; n < e.length; n++) {
            var r, s, h = e[n];
            (r = new THREE.CylinderBufferGeometry(h.rTop, h.rBot, h.height, 8)).applyMatrix((new THREE.Matrix4).makeTranslation(0, -h.height / 2, 0)), (s = new THREE.Mesh(r, o)).position.y = h.y, s.rotation.x = -.2 * n, this.rightArmSegments.push(s), i.add(s), i = s
        }
    }, _createBoundingBox: function () {
        var e = new THREE.Box3;
        e.setFromObject(this), this.boundingBox = new THREE.Mesh(new THREE.BoxBufferGeometry(e.max.x - e.min.x + 50, e.max.y - e.min.y + 50, e.max.z - e.min.z + 50), new THREE.MeshBasicMaterial({
            color: 16711680,
            wireframe: !0,
            visible: !1
        })), this.add(this.boundingBox)
    }
});
CW.Grid = function () {
    THREE.Object3D.call(this), this.create(), this.hide()
}, CW.Grid.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Grid,
    create: function () {
        for (var e = Math.floor(500), t = new THREE.Geometry, r = new THREE.LineBasicMaterial({
            color: 3355443,
            opacity: .1,
            transparent: !0
        }), c = -e; c <= e; c += 10) t.vertices.push(new THREE.Vector3(-e, 0, c)), t.vertices.push(new THREE.Vector3(e, 0, c)), t.vertices.push(new THREE.Vector3(c, 0, -e)), t.vertices.push(new THREE.Vector3(c, 0, e));
        var i = new THREE.LineSegments(t, r);
        this.add(i);
        var E = new THREE.Geometry;
        E.vertices.push(new THREE.Vector3(-e, 0, 0), new THREE.Vector3(e, 0, 0), new THREE.Vector3(0, 0, -e), new THREE.Vector3(0, 0, e));
        for (c = -e; c <= e; c += 100) E.vertices.push(new THREE.Vector3(-e, 0, c)), E.vertices.push(new THREE.Vector3(e, 0, c)), E.vertices.push(new THREE.Vector3(c, 0, -e)), E.vertices.push(new THREE.Vector3(c, 0, e));
        var n = new THREE.LineBasicMaterial({color: 0, opacity: .4, transparent: !0}), s = new THREE.LineSegments(E, n);
        this.add(s)
    },
    show: function () {
        this.visible = !0
    },
    hide: function () {
        this.visible = !1
    }
});
CW.HoleBox = function (t, e, i, s, o, h, a) {
    THREE.Object3D.call(this), this.width = t, this.height = e, this.depth = i, this.outColor = s, this.inColor = o, this.frameColor = h || "#f64f59", this.doorColor = "#d29c9c", this.standard = a, this.innerGroup, this.centerGroup, this.left, this.right, this.front, this.back, this.bottom, this.door, this.doorPlane, this.doorFrames = [], this.direction = ""
}, CW.HoleBox.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.HoleBox, update: function () {
    }, init: function (t) {
        this.direction = t, this._createGroup(), this._createHole(), this._createDoor()
    }, show: function (t) {
        this.visible = !0, this.drawDoorFrame(t)
    }, open: function (t) {
        CW.Util.forEach(this.doorPlane.geometry.faces, function (t, e) {
            (t.materialIndex = 0) !== e && 1 !== e && 6 !== e && 7 !== e && 8 !== e && 9 !== e && 10 !== e && 11 !== e || (t.materialIndex = 1)
        }), this.doorPlane.geometry.elementsNeedUpdate = !0;
        var e = Math.PI / 2;
        "left" === this.standard && (e = -Math.PI / 2), TweenLite.to(this.door.rotation, .6, {
            z: e,
            ease: Power2.easeInOut,
            onComplete: function () {
                t && t()
            }
        })
    }, close: function (t) {
        var e = this;
        TweenLite.to(this.door.rotation, .6, {
            z: 0, ease: Power2.easeInOut, onComplete: function () {
                CW.Util.forEach(e.doorPlane.geometry.faces, function (t, e) {
                    t.materialIndex = 0
                }), e.doorPlane.geometry.elementsNeedUpdate = !0, e.eraseDoorFrame(function () {
                    t && t()
                })
            }
        })
    }, drawDoorFrame: function (t) {
        var i = [{scale: {x: this.width, y: 10, z: 10}}, {scale: {x: 10, y: 10, z: this.depth}}, {
            scale: {
                x: this.width,
                y: 10,
                z: 10
            }
        }, {scale: {x: 10, y: 10, z: this.depth}}];
        CW.Util.forEach(this.doorFrames, function (t, e) {
            t.visible = !1, t.scale.x = 10, t.scale.z = 10
        }), CW.Util.forEach(this.doorFrames, function (t, e) {
            TweenLite.set(t, {delay: .3 * e, visible: !0}), TweenLite.to(t.scale, .3, {
                delay: .3 * e,
                x: i[e].scale.x,
                z: i[e].scale.z,
                ease: Sine.easeInOut
            })
        }), TweenLite.delayedCall(.3 + .3 * (this.doorFrames.length - 1), function () {
            t && t()
        })
    }, eraseDoorFrame: function (t) {
        var s = 0;
        CW.Util.forEach(this.doorFrames, function (t, e) {
            var i = 1.2 - .3 * e;
            TweenLite.set(t, {delay: i + .3, visible: !1}), TweenLite.to(t.scale, .3, {
                delay: i,
                x: 10,
                z: 10,
                ease: Power2.easeInOut
            }), s = Math.max(s, i + .3)
        }), TweenLite.delayedCall(s, function () {
            t && t()
        })
    }, _open: function (t) {
        var e = this;
        this.visible = !0, this.left.scale.z = .1, this.right.scale.z = .1, this.front.scale.x = .12, this.back.scale.x = .12, this.bottom.scale.z = .1, this.bottom.scale.x = .1, this.left.position.x = -this.width / 2 * .1, this.right.position.x = this.width / 2 * .1, this.back.position.z = this.depth / 2 - .1 * this.depth + 1, TweenLite.to(this.bottom.scale, .4, {
            x: 1,
            ease: Circ.easeInOut
        }), TweenLite.to(this.front.scale, .4, {x: 1, ease: Circ.easeInOut}), TweenLite.to(this.back.scale, .4, {
            x: 1,
            ease: Circ.easeInOut
        }), TweenLite.to(this.left.position, .4, {
            x: -this.width / 2,
            ease: Circ.easeInOut
        }), TweenLite.to(this.right.position, .4, {
            x: this.width / 2, ease: Circ.easeInOut, onComplete: function () {
                TweenLite.to(e.left.scale, .6, {z: 1, ease: Circ.easeInOut}), TweenLite.to(e.right.scale, .6, {
                    z: 1,
                    ease: Circ.easeInOut
                }), TweenLite.to(e.back.position, .6, {
                    z: -e.depth / 2,
                    ease: Circ.easeInOut
                }), TweenLite.to(e.bottom.scale, .6, {
                    z: 1, ease: Circ.easeInOut, onComplete: function () {
                        t && t()
                    }
                })
            }
        })
    }, _close: function () {
        var t = this;
        TweenLite.to(t.left.scale, .6, {z: .1, ease: Power2.easeInOut}), TweenLite.to(t.right.scale, .6, {
            z: .1,
            ease: Power2.easeInOut
        }), TweenLite.to(t.back.position, .6, {
            z: this.depth / 2 - .1 * this.depth + 1,
            ease: Power2.easeInOut
        }), TweenLite.to(t.bottom.scale, .6, {
            z: .1, ease: Power2.easeInOut, onComplete: function () {
                TweenLite.to(t.bottom.scale, .4, {
                    x: .1,
                    ease: Power2.easeInOut
                }), TweenLite.to(t.front.scale, .4, {
                    x: .1,
                    ease: Power2.easeInOut
                }), TweenLite.to(t.back.scale, .4, {
                    x: .1,
                    ease: Power2.easeInOut
                }), TweenLite.to(t.left.position, .4, {
                    x: -t.width / 2 * .1,
                    ease: Power2.easeInOut
                }), TweenLite.to(t.right.position, .4, {
                    x: t.width / 2 * .1,
                    ease: Power2.easeInOut,
                    onComplete: function () {
                    }
                }), TweenLite.delayedCall(.25, function () {
                    log("complete close"), t.visible = !1
                })
            }
        })
    }, _createDoor: function () {
        var t = [new THREE.MeshBasicMaterial({color: this.outColor}), new THREE.MeshLambertMaterial({color: this.doorColor})];
        this.door = new THREE.Group, this.door.position.set(-this.width / 2, 0, -this.depth / 2), this.innerGroup.add(this.door);
        var e = new THREE.BoxGeometry(this.width, 30, this.depth);
        CW.Util.forEach(e.faces, function (t, e) {
            t.materialIndex = 0
        });
        new THREE.MeshBasicMaterial({color: this.outColor});
        this.doorPlane = new THREE.Mesh(e, t), this.doorPlane.position.x = this.width / 2, this.doorPlane.position.y = -14, this.door.add(this.doorPlane), "left" === this.standard && (this.door.position.x = this.width / 2, this.doorPlane.position.x = -this.width / 2), this._createDoorFrames()
    }, _createDoorFrames: function () {
        var s = new THREE.MeshBasicMaterial({color: this.frameColor}), o = this;
        this.tn = 4;
        var t = new THREE.BoxBufferGeometry(1, 1, 1);
        t.applyMatrix((new THREE.Matrix4).makeTranslation(.5, 0, 0));
        var e = new THREE.BoxBufferGeometry(1, 1, 1);
        e.applyMatrix((new THREE.Matrix4).makeTranslation(-.5, 0, 0));
        var i = new THREE.BoxBufferGeometry(1, 1, 1);
        i.applyMatrix((new THREE.Matrix4).makeTranslation(0, 0, -.5));
        var h = new THREE.BoxBufferGeometry(1, 1, 1);
        h.applyMatrix((new THREE.Matrix4).makeTranslation(0, 0, .5));
        var a = [{geo: t, pos: {x: 0, y: 2, z: -this.depth / 2}, scale: {x: this.width, y: 10, z: 10}}, {
            geo: h,
            pos: {x: this.width, y: 2, z: -this.depth / 2},
            scale: {x: 10, y: 10, z: this.depth}
        }, {geo: e, pos: {x: this.width, y: 2, z: this.depth / 2}, scale: {x: this.width, y: 10, z: 10}}, {
            geo: i,
            pos: {x: 0, y: 2, z: this.depth / 2},
            scale: {x: 10, y: 10, z: this.depth}
        }];
        "left" === this.standard && CW.Util.forEach(a, function (t, e) {
            t.pos.x -= o.width
        }), CW.Util.forEach(a, function (t, e) {
            var i = new THREE.Mesh(t.geo, s);
            i.position.set(t.pos.x, t.pos.y, t.pos.z), i.scale.set(t.scale.x, t.scale.y, t.scale.z), i.visible = !1, o.doorFrames.push(i), o.door.add(i)
        })
    }, _createGroup: function () {
        this.innerGroup = new THREE.Group, this.add(this.innerGroup), this.centerGroup = new THREE.Group, this.centerGroup.position.set(0, 0, -this.depth / 2), this.innerGroup.add(this.centerGroup), this.left = new THREE.Group, this.right = new THREE.Group, this.front = new THREE.Group, this.back = new THREE.Group, this.bottom = new THREE.Group, this.centerGroup.add(this.left), this.centerGroup.add(this.right), this.centerGroup.add(this.front), this.centerGroup.add(this.back), this.centerGroup.add(this.bottom), this.front.position.set(0, 0, this.depth / 2), this.back.position.set(0, 0, -this.depth / 2), this.left.position.set(-this.width / 2, 0, this.depth / 2), this.right.position.set(this.width / 2, 0, this.depth / 2), this.bottom.position.set(0, -this.height, this.depth / 2)
    }, _createHole: function () {
        var t = new THREE.MeshBasicMaterial({color: this.outColor}),
            e = new THREE.MeshPhongMaterial({color: this.inColor, side: THREE.BackSide}),
            i = new THREE.PlaneBufferGeometry(this.width, this.height),
            s = new THREE.BoxBufferGeometry(this.width + 10, this.height, 2);
        this.frontF = new THREE.Mesh(s, t), this.frontF.position.set(0, -this.height / 2 - 3, 2), this.frontB = new THREE.Mesh(i, e), this.frontB.position.set(0, -this.height / 2, 0), this.front.add(this.frontB);
        var o = i.clone().rotateY(Math.PI),
            h = new THREE.BoxBufferGeometry(this.width + 10, this.height, 10).rotateY(Math.PI);
        this.backF = new THREE.Mesh(h, t), this.backF.position.set(0, -this.height / 2 - 1, -7), this.back.add(this.backF), this.backB = new THREE.Mesh(o, e), this.backB.position.set(0, -this.height / 2, 0), this.back.add(this.backB), (i = new THREE.PlaneBufferGeometry(this.depth, this.height)).rotateY(-Math.PI / 2), (s = new THREE.BoxBufferGeometry(this.depth + 10, this.height, 2)).rotateY(-Math.PI / 2), this.leftF = new THREE.Mesh(s, t), this.leftF.position.set(-3, -this.height / 2 - 1, -this.depth / 2), "right" !== this.direction && this.left.add(this.leftF), this.leftB = new THREE.Mesh(i, e), this.leftB.position.set(0, -this.height / 2 - 1, -this.depth / 2), this.left.add(this.leftB);
        var a = new THREE.PlaneBufferGeometry(this.depth, this.height);
        a.rotateY(Math.PI / 2);
        var n = new THREE.BoxBufferGeometry(this.depth + 3, this.height, 2);
        n.rotateY(Math.PI / 2), this.rightF = new THREE.Mesh(n, t), this.rightF.position.set(3, -this.height / 2 - 1, -this.depth / 2), "left" !== this.direction && this.right.add(this.rightF), this.rightB = new THREE.Mesh(a, e), this.rightB.position.set(0, -this.height / 2 - 1, -this.depth / 2), this.right.add(this.rightB), (i = new THREE.PlaneBufferGeometry(this.width, this.depth)).rotateX(Math.PI / 2);
        s = new THREE.BoxBufferGeometry(this.width + 6, 2, this.depth + 6);
        this.bottomF = new THREE.Mesh(s, t), this.bottomF.position.set(0, -2, -this.depth / 2), this.bottom.add(this.bottomF), this.bottomB = new THREE.Mesh(i, e), this.bottomB.position.set(0, 9, -this.depth / 2), this.bottom.add(this.bottomB)
    }
});

CW.HomeDust = function () {
    THREE.Object3D.call(this), this.isUpdate = !0, this.velocity = new THREE.Vector3, this.rotateCycle = CW.Util.random(-.02, .02), this._init(), this.reset(), this.position.x = CW.Util.random(-1e4, 1e4)
}, CW.HomeDust.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.HomeDust,
    update: function () {
        this.isUpdate && (this.position.add(this.velocity), this.rotation.y += this.rotateCycle, this.rotation.x += this.rotateCycle / 2, 3e3 < this.position.x && this.reset())
    },
    reset: function () {
        this.position.y = CW.Util.random(50, 4e3), this.position.z = CW.Util.random(-3e3, 500), this.position.x = CW.Util.random(-1e4, -2e3), this.rotateCycle = CW.Util.random(-.02, .02), this.velocity.x = CW.Util.random(1, 5), this.velocity.z = CW.Util.random(4, 12)
    },
    _init: function () {
        var t = Math.floor(CW.Util.random(10, 30)), i = Math.floor(CW.Util.random(10, 30)),
            e = new THREE.PlaneBufferGeometry(t, i).rotateX(-Math.PI / 2),
            o = new THREE.MeshLambertMaterial({color: 255, side: THREE.BackSide}),
            s = (o = new THREE.MeshLambertMaterial({color: 4473924, side: THREE.DoubleSide}), new THREE.Mesh(e, o));
        s.castShadow = !0, this.add(s)
    }
});
CW.HomeFloor = function () {
    THREE.Object3D.call(this), this.WIDE_FLOOR_WIDTH = 2e4, this.WIDE_FLOOR_DEPTH = 1e4, this.WIDE_FLOOR_HEIGHT = 100, this.finalColor = "#ffffff", this.wideFloor, this.floors = [], this._init()
}, CW.HomeFloor.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.HomeFloor,
    update: function () {
    },
    _init: function () {
        this._createWideFloor(), this._createGradientFloors()
    },
    _createWideFloor: function () {
        var o = new THREE.BoxBufferGeometry(this.WIDE_FLOOR_WIDTH, this.WIDE_FLOOR_HEIGHT, this.WIDE_FLOOR_DEPTH),
            t = new THREE.MeshBasicMaterial({color: this.finalColor});
        this.wideFloor = new THREE.Mesh(o, t), this.wideFloor.position.set(0, -(this.WIDE_FLOOR_HEIGHT / 2 + 4), -this.WIDE_FLOOR_DEPTH / 2 + 2e3), this.add(this.wideFloor)
    },
    _createGradientFloors: function () {
        for (var o, t, i, e = this.WIDE_FLOOR_WIDTH, s = this.WIDE_FLOOR_HEIGHT, r = this.finalColor, E = new THREE.BoxBufferGeometry(e, s, 200), h = this.wideFloor.position.z + this.WIDE_FLOOR_DEPTH / 2, l = 0; l < 25; l++) o = CW.Util.getColorRgb(r, "#EECDA3", l / 25), i = new THREE.MeshBasicMaterial({
            color: o,
            wireframe: !1
        }), (t = new THREE.Mesh(E, i)).position.set(0, -(s / 2 + 4), h + 200 * l + 100), this.add(t), this.floors.push(t)
    }
});
CW.House = function () {
    THREE.Object3D.call(this), this.door, this.wall, this.window, this.cover, this._init()
}, CW.House.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.House, update: function () {
    }, _init: function () {
        this._create()
    }, _create: function () {
        this._createDoor(), this._createWindow(), this._createCover()
    }, _createDoor: function () {
        this.door = new CW.HouseDoor, this.door.position.z = this.door.ft / 2, this.add(this.door)
    }, _createWindow: function () {
        this.window = new CW.HouseWindow, this.add(this.window)
    }, _createWall: function () {
        new THREE.BoxBufferGeometry(1, 1, 1).applyMatrix((new THREE.Matrix4).makeTranslation(0, .5, -.5)), this.wall = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1).applyMatrix((new THREE.Matrix4).makeTranslation(0, .5, -.5)), new THREE.MeshBasicMaterial({color: 16777215})), this.wall.scale.set(800, 1e3, 500), this.add(this.wall)
    }, _createCover: function () {
        var t = new THREE.PlaneGeometry(800, 1500, 20, 20);
        t.applyMatrix((new THREE.Matrix4).makeTranslation(0, 500, 0));
        var e = new THREE.MeshBasicMaterial({color: 16777215, wireframe: !1, side: THREE.DoubleSide});
        CW.Util.forEach(t.vertices, function (t, e) {
            t.x += CW.Util.random(-10, 10), t.y += CW.Util.random(-10, 10), t.z += CW.Util.random(-20, 20)
        }), this.cover = new THREE.Mesh(t, e), this.cover.position.z = -30, this.add(this.cover)
    }
});
CW.HouseDoor = function () {
    THREE.Object3D.call(this), this.width = 300, this.depth = 50, this.height = 600, this.ft = 30, this.frames = [], this.plane, this.handle, this.boundingBox, this._init()
}, CW.HouseDoor.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.HouseDoor, update: function () {
    }, open: function (t) {
        TweenLite.to(this.handle.rotation, .6, {
            z: -Math.PI / 2,
            ease: Power1.easeInOut
        }), TweenLite.to(this.plane.rotation, 1, {
            delay: .4,
            y: CW.Util.degToRad(120),
            ease: Power1.easeInOut,
            onComplete: function () {
                t && t()
            }
        })
    }, close: function (t) {
        TweenLite.to(this.handle.rotation, .6, {
            delay: .8,
            z: 0,
            ease: Power1.easeInOut
        }), TweenLite.to(this.plane.rotation, 1, {
            y: 0, ease: Power1.easeInOut, onComplete: function () {
                t && t()
            }
        })
    }, _init: function () {
        this._create()
    }, _create: function () {
        this._createFrames(), this._createPlane(), this._createHandle(), this._createBoundingBox()
    }, _createFrames: function () {
        var i = this, s = new THREE.MeshBasicMaterial({color: 2236962}),
            t = new THREE.BoxBufferGeometry(this.width + 2 * this.ft, this.ft, this.ft),
            e = new THREE.BoxBufferGeometry(this.ft, this.height, this.ft),
            h = [{geo: t, pos: {x: 0, y: this.height + 1.5 * this.ft, z: 0}}, {
                geo: t,
                pos: {x: 0, y: this.ft / 2, z: 0}
            }, {geo: e, pos: {x: -this.width / 2 - this.ft / 2, y: this.height / 2 + this.ft, z: 0}}, {
                geo: e,
                pos: {x: this.width / 2 + this.ft / 2, y: this.height / 2 + this.ft, z: 0}
            }];
        CW.Util.forEach(h, function (t) {
            var e = new THREE.Mesh(t.geo, s);
            e.position.set(t.pos.x, t.pos.y, t.pos.z), e.visible = !0, i.frames.push(e), i.add(e)
        })
    }, _createPlane: function () {
        var t = new THREE.BoxBufferGeometry(this.width, this.height, this.ft - 4);
        t.applyMatrix((new THREE.Matrix4).makeTranslation(-this.width / 2, 0, -(this.ft - 4) / 2));
        var e = new THREE.MeshLambertMaterial({color: 11184810, wireframe: !1});
        this.plane = new THREE.Mesh(t, e), this.plane.position.set(this.width / 2, this.height / 2 + this.ft, (this.ft - 4) / 2), this.add(this.plane)
    }, _createHandle: function () {
        this.handle = new THREE.Mesh(new THREE.BoxBufferGeometry(20, 50, 30), new THREE.MeshBasicMaterial({color: 2236962})), this.handle.position.set(40 - this.width, 0, 0), this.plane.add(this.handle)
    }, _createBoundingBox: function () {
        this.boundingBox = new THREE.Mesh(new THREE.BoxBufferGeometry(this.width + 2 * this.ft + 0, this.height + 2 * this.ft + 0, this.ft + 0), new THREE.MeshBasicMaterial({
            color: 16711680,
            visible: !1
        })), this.boundingBox.position.y = this.height / 2 + this.ft, this.add(this.boundingBox)
    }
});
CW.HouseFakeShadow = function () {
    THREE.Object3D.call(this), this.door, this.doorPlane, this.roof, this.commonMaterial = new THREE.MeshLambertMaterial({
        color: 255,
        side: THREE.BackSide
    }), this._init()
}, CW.HouseFakeShadow.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.HouseFakeShadow, update: function () {
    }, openDoor: function (o) {
        TweenLite.killTweensOf(this.doorPlane.rotation), TweenLite.to(this.doorPlane.rotation, 2, {
            y: CW.Util.degToRad(120),
            ease: Power1.easeInOut,
            onComplete: function () {
                o && o()
            }
        })
    }, closeDoor: function (o) {
        TweenLite.killTweensOf(this.doorPlane.rotation), TweenLite.to(this.doorPlane.rotation, 2, {
            y: 0,
            ease: Power1.easeInOut,
            onComplete: function () {
                o && o()
            }
        })
    }, _init: function () {
        this._createDoor()
    }, _createWall: function () {
        var o = 700, e = new THREE.PlaneBufferGeometry(1e3, 10), t = new THREE.PlaneBufferGeometry(10, o),
            a = this.commonMaterial, s = new THREE.Mesh(e, a);
        s.position.y = o, s.castShadow = !0, this.add(s);
        var n = new THREE.Mesh(t, a);
        n.position.set(-500, 350, 0), n.castShadow = !0, this.add(n);
        var r = new THREE.Mesh(t, a);
        r.position.set(500, 350, 0), r.castShadow = !0, this.add(r)
    }, _createDoor: function () {
        this.door = new THREE.Group, this.add(this.door);
        this._createDoorFrames(300, 600, 30), this._createDoorPlane(300, 600, 30)
    }, _createDoorFrames: function (o, e, t) {
        var a = this, s = new THREE.PlaneBufferGeometry(o + 2 * t, t), n = new THREE.PlaneBufferGeometry(t, e + 2 * t),
            r = this.commonMaterial,
            i = [{geo: s, posX: 0, posY: e + t + t / 2, posZ: 0}, {geo: s, posX: 0, posY: t / 2, posZ: 0}, {
                geo: n,
                posX: -(o / 2 + t / 2),
                posY: t + e / 2,
                posZ: 0
            }, {geo: n, posX: o / 2 + t / 2, posY: t + e / 2, posZ: 0}];
        CW.Util.forEach(i, function (o, e) {
            var t = new THREE.Mesh(o.geo, r);
            t.position.set(o.posX, o.posY, o.posZ), t.castShadow = !0, a.door.add(t)
        })
    }, _createDoorPlane: function (o, e, t) {
        var a = this, s = e / 2 - 20, n = o - 40 - 20, r = new THREE.PlaneBufferGeometry(o, s),
            i = new THREE.PlaneBufferGeometry(20, 40), h = new THREE.PlaneBufferGeometry(n, 40),
            E = new THREE.MeshBasicMaterial({color: 16777215, side: THREE.DoubleSide}),
            d = [{geo: r, posX: -o / 2, posY: e / 2 - s / 2, posZ: 0}, {
                geo: r,
                posX: -o / 2,
                posY: -e / 2 + s / 2,
                posZ: 0
            }, {geo: i, posX: 10 - o, posY: 0, posZ: 0}, {geo: h, posX: -n / 2, posY: 0, posZ: 0}];
        this.doorPlane = new THREE.Group, this.doorPlane.position.set(o / 2, e / 2 + t, 0), this.doorPlane.rotation.y = 0, this.door.add(this.doorPlane), CW.Util.forEach(d, function (o, e) {
            var t = new THREE.Mesh(o.geo, E);
            t.position.set(o.posX, o.posY, o.posZ), t.castShadow = !0, a.doorPlane.add(t)
        })
    }, _createRoof: function () {
        var o = 800, e = CW.Util.degToRad(30), t = new THREE.PlaneBufferGeometry(o, 40);
        t.applyMatrix((new THREE.Matrix4).makeTranslation(-380, 0, 0)), t.rotateZ(e);
        var a = new THREE.PlaneBufferGeometry(o, 40);
        a.applyMatrix((new THREE.Matrix4).makeTranslation(380, 0, 0)), a.rotateZ(-e), this.roof = new THREE.Group, this.add(this.roof);
        var s = new THREE.Mesh(t, this.commonMaterial);
        s.castShadow = !0, this.roof.add(s);
        var n = new THREE.Mesh(a, this.commonMaterial);
        n.castShadow = !0, this.roof.add(n)
    }
});
CW.HouseWindow = function () {
    THREE.Object3D.call(this), this.width, this._init()
}, CW.HouseWindow.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.HouseWindow,
    update: function () {
    },
    _init: function () {
    },
    _create: function () {
    }
});
CW.Larva = function (t) {
    THREE.Object3D.call(this), this.firstColor = "#23074d", this.finalColor = "#cc5333", this.isOutBorder = !1, this.numSegments = 20, this.segments = [], this.segRadius = t || 300, this.depth, this.cycle = Math.random() * Math.PI, this.cycleValue = CW.Util.random(.05, .09), this.maxSpeed = 35, this.velocity = new THREE.Vector3(0, 0, 0), this.acceleration = new THREE.Vector3(0, 0, CW.Util.random(.5, 2)), this.head
}, CW.Larva.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Larva, init: function () {
        this._createBody(), this._createEyes()
    }, update: function () {
        this.velocity.add(this.acceleration), this.velocity.length() > this.maxSpeed && this.velocity.setLength(this.maxSpeed), this.position.add(this.velocity), this.isOutWall = !0, this.isOutWall && (this.cycle += this.cycleValue, this._updateBody(), this.head.rotation.x = -CW.Util.degToRad(5 * Math.cos(this.cycle) + 10))
    }, checkOutWall: function (t) {
        return !!this.isOutWall || (this.position.z - this.depth > t && (this.isOutWall = !0), !1)
    }, _updateBody: function () {
        for (var t = 0; t < this.numSegments; t++) {
            var i = .4 * -t, e = Math.PI / (190 / (t + 1)), s = Math.sin(this.cycle + i) * e;
            this.segments[t].rotation.x = s
        }
    }, _createBody: function () {
        for (var t = new THREE.SphereBufferGeometry(this.segRadius, 16, 16), i = this, e = 0, s = 0; s < this.numSegments; s++) {
            var a = s / this.numSegments, h = CW.Util.getColorFromGradient(this.firstColor, this.finalColor, a),
                o = "rgb(" + h[0] + ", " + h[1] + ", " + h[2] + ")", n = new THREE.MeshBasicMaterial({color: o}),
                r = new THREE.Mesh(t, n);
            r.position.z = e, i.add(r), i = r, e = -this.segRadius / 2 + 10, this.segments.push(i)
        }
        var d = new THREE.Box3;
        d.setFromObject(this), this.depth = d.max.z - d.min.z
    }, _createEyes: function () {
        this.head = new THREE.Group, this.add(this.head);
        var t = this.segRadius / 5, i = new THREE.CylinderBufferGeometry(t, t, 8, 8).rotateX(Math.PI / 2),
            e = new THREE.MeshLambertMaterial({color: 16777215}), s = new THREE.Mesh(i, e), a = CW.Util.degToRad(60);
        s.position.x = Math.cos(a) * this.segRadius, s.position.z = Math.sin(a) * this.segRadius, s.rotation.y = CW.Util.degToRad(30), this.head.add(s);
        var h = new THREE.Mesh(i, e);
        a = CW.Util.degToRad(120), h.position.x = Math.cos(a) * this.segRadius, h.position.z = Math.sin(a) * this.segRadius, h.rotation.y = CW.Util.degToRad(-30), this.head.add(h)
    }
});
CW.Pill = function (t, i, s, e, a) {
    THREE.Object3D.call(this), t = t || 0, i = i || 0, s = s || 0, this.position.set(t, i, s);
    var h = CW.Util.random(1, 1.4);
    this.acceleration = new THREE.Vector3(h, 0, 0), this.velocity = new THREE.Vector3(1, 0, 0), this.maxspeed = CW.Util.random(30, 50), this.maxRadius = e || 30, this.height = a - 2 * this.maxRadius, this.group, this.shapeGroup, this._init()
}, CW.Pill.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    _constructor: CW.Pill, update: function () {
        this.velocity.add(this.acceleration), this.velocity.length() > this.maxspeed && this.velocity.setLength(this.maxspeed), this.position.add(this.velocity)
    }, _init: function () {
        this.group = new THREE.Group, this.add(this.group), this.shapeGroup = new THREE.Group, this.shapeGroup.rotation.z = -Math.PI / 2, this.group.add(this.shapeGroup);
        var t = new THREE.Group;
        t.position.y = -this.maxRadius, this.shapeGroup.add(t);
        for (var i = this.height / 20, s = new THREE.CylinderBufferGeometry(this.maxRadius, this.maxRadius, i, 12), e = "#6c567b", a = "#c06c84", h = 0; h < 20; h++) {
            var o = CW.Util.getColorRgb(e, a, h / 20), r = new THREE.MeshBasicMaterial({color: o}),
                n = new THREE.Mesh(s, r);
            n.position.y = -i / 2 - h * i, n.castShadow = !0, t.add(n)
        }
        var p = new THREE.SphereBufferGeometry(this.maxRadius, 12, 12),
            c = new THREE.Mesh(p, new THREE.MeshBasicMaterial({color: e}));
        c.castShadow = !0, c.position.y = -this.maxRadius, this.shapeGroup.add(c);
        var d = new THREE.Mesh(p, new THREE.MeshBasicMaterial({color: a}));
        d.position.y = -this.height - this.maxRadius, d.castShadow = !0, this.shapeGroup.add(d)
    }
});
CW.Planet = function (t) {
    THREE.Object3D.call(this), this.radius = t, this.land, this.hills = [], this.flag, this.boundingBox, this._init()
}, CW.Planet.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Planet, update: function () {
        this.land.rotation.x -= .009, this.flag.children[0].update()
    }, dispose: function () {
    }, _init: function () {
        this._createLand(), this._createHills(), this._createFlag(), this._createBoundingBox()
    }, _createFlag: function () {
        var t = new CW.TriangleFlag;
        t.rotation.x = -Math.PI / 2, t.rotation.y = Math.PI / 2, t.scale.set(2, 2, 2), this.flag = new THREE.Group, this.flag.add(t), this.flag.position.copy(this.hills[0].position), this.flag.lookAt(this.land.position), this.land.add(this.flag)
    }, _createHills: function () {
        var n = this, r = ["#355c7d", "#c06c84", "#f67280"], d = r.length;
        CW.Util.forEach([{
            pos: {x: -500, y: 500, z: 0},
            scale: {x: 2, y: 1.5},
            radiusTop: 200,
            radiusBottom: 320,
            height: 400,
            addLength: -100,
            color: 5475110
        }, {
            pos: {x: -500, y: 500, z: -200},
            scale: {x: 1.7, y: 2},
            radiusTop: 70,
            radiusBottom: 320,
            height: 600,
            addLength: 0,
            color: 5475110
        }, {
            pos: {x: 500, y: 400, z: 300},
            scale: {x: 1.7, y: 1.5},
            radiusTop: 200,
            radiusBottom: 320,
            height: 400,
            addLength: -100,
            color: 5475110
        }, {
            pos: {x: 500, y: 300, z: 0},
            scale: {x: 1.7, y: 1.5},
            radiusTop: 200,
            radiusBottom: 400,
            height: 600,
            addLength: -100,
            color: 5475110
        }, {
            pos: {x: 500, y: 300, z: -500},
            scale: {x: 1.7, y: 1.5},
            radiusTop: 200,
            radiusBottom: 320,
            height: 300,
            addLength: -100,
            color: 5475110
        }, {
            pos: {x: 400, y: 200, z: -500},
            scale: {x: 1.7, y: 1.5},
            radiusTop: 80,
            radiusBottom: 320,
            height: 500,
            addLength: 0,
            color: 5475110
        }, {
            pos: {x: -400, y: -200, z: 500},
            scale: {x: 1.7, y: 1.5},
            radiusTop: 150,
            radiusBottom: 320,
            height: 300,
            addLength: -100,
            color: 5475110
        }, {
            pos: {x: -500, y: -100, z: 400},
            scale: {x: 1.7, y: 1.5},
            radiusTop: 200,
            radiusBottom: 360,
            height: 500,
            addLength: -100,
            color: 5475110
        }, {
            pos: {x: 500, y: -400, z: 400},
            scale: {x: 2, y: 1.5},
            radiusTop: 200,
            radiusBottom: 320,
            height: 300,
            addLength: -100,
            color: 5475110
        }, {
            pos: {x: 300, y: -500, z: 400},
            scale: {x: 2, y: 1.5},
            radiusTop: 100,
            radiusBottom: 320,
            height: 400,
            addLength: -100,
            color: 5475110
        }, {
            pos: {x: -500, y: -400, z: -400},
            scale: {x: 2, y: 1.5},
            radiusTop: 200,
            radiusBottom: 320,
            height: 300,
            addLength: -100,
            color: 5475110
        }, {
            pos: {x: -300, y: -500, z: -400},
            scale: {x: 2, y: 1.5},
            radiusTop: 100,
            radiusBottom: 320,
            height: 400,
            addLength: -100,
            color: 5475110
        }], function (t, o) {
            var i = new THREE.CylinderGeometry(t.radiusTop, t.radiusBottom, t.height, 14).rotateX(-Math.PI / 2);
            CW.Util.forEach(i.vertices, function (t, o) {
                t.x += CW.Util.random(-40, 40), t.y += CW.Util.random(-40, 40), t.z += CW.Util.random(-15, 15)
            });
            var a = r[Math.floor(CW.Util.random(0, d))], e = new THREE.Mesh(i, new THREE.MeshBasicMaterial({color: a})),
                s = new THREE.Vector3(t.pos.x, t.pos.y, t.pos.z);
            s.normalize(), s.setLength(n.radius + t.addLength), e.position.copy(s), e.scale.set(t.scale.x, t.scale.y, 1), e.lookAt(n.land.position), n.land.add(e), n.hills.push(e)
        })
    }, _createLand: function () {
        var i = this, t = new THREE.OctahedronGeometry(this.radius, 2);
        CW.Util.forEach(t.vertices, function (t, o) {
            t.x += CW.Util.random(-100, 100), t.y += CW.Util.random(-100, 100), t.z += CW.Util.random(-100, 100), t.normalize(), t.setLength(i.radius)
        }), this.land = new THREE.Mesh(t, new THREE.MeshBasicMaterial({color: 7101307})), this.add(this.land)
    }, _createBoundingBox: function () {
        var t = new THREE.Box3;
        t.setFromObject(this);
        var o = t.max.x - t.min.x, i = t.max.y - t.min.y, a = t.max.z - t.min.z;
        this.boundingBox = new THREE.Mesh(new THREE.BoxBufferGeometry(o, i, a), new THREE.MeshBasicMaterial({
            color: 16711680,
            wireframe: !0,
            visible: !1
        })), this.add(this.boundingBox)
    }
});
CW.Rain = function () {
    THREE.Object3D.call(this), this.rainDrops = [], this.floor, this.STATE_DEFAULT = "default", this.STATE_RAINY = "rainy", this.state = this.STATE_DEFAULT, this._init()
}, CW.Rain.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Rain,
    update: function () {
        this.state === this.STATE_RAINY && CW.Util.forEach(this.rainDrops, function (t) {
            t.update()
        })
    },
    start: function () {
        this.state = this.STATE_RAINY, CW.Util.forEach(this.rainDrops, function (t) {
            t.show()
        })
    },
    stop: function () {
        this.state = this.STATE_DEFAULT;
        var t = this;
        TweenLite.delayedCall(.3, function () {
            CW.Util.forEach(t.rainDrops, function (t, i) {
                TweenLite.to(t.position, 1.5, {y: 3e3, ease: Power2.easeInOut})
            })
        })
    },
    setFloor: function (t) {
        this.floor = t
    },
    hit: function (t) {
        this.floor.dig(t.target.position)
    },
    dispose: function () {
        this.floor = null
    },
    _init: function () {
        for (var t, i = 0; i < 70; i++) t = new CW.RainDrop({
            floorX: {min: -500, max: 500},
            floorZ: {min: -500, max: 500},
            rangeX: {min: -1e3, max: 1e3},
            rangeY: {min: 1e3, max: 4e3},
            rangeZ: {min: -1e3, max: 1e3}
        }), this.add(t), this.rainDrops.push(t), t.addEventListener("change", this.hit.bind(this))
    }
});
CW.RainDrop = function (i) {
    THREE.Object3D.call(this), this.floorX = i.floorX, this.floorZ = i.floorZ, this.rangeX = i.rangeX, this.rangeY = i.rangeY, this.rangeZ = i.rangeZ, this.changeEvent = {type: "change"};
    var t = [13651331, 14516903, 13602525, 11044053];
    this.dropColor = t[Math.floor(CW.Util.random(0, t.length))], this.water = null, this.pieceMaterial = new THREE.MeshBasicMaterial({
        color: this.dropColor,
        transparent: !0,
        opacity: 0
    }), this.pieces = [], this.spreading = !1, this.velocity = new THREE.Vector3(0, -1, 0), this.acceleration = new THREE.Vector3(0, CW.Util.random(-.03, -.08), 0), this._init(), this.reset(), this.hide()
}, CW.RainDrop.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.RainDrop, update: function () {
        this.visible && (this.spreading || (this.velocity.add(this.acceleration), this.position.add(this.velocity), this.water.scale.y += 1, this.position.x > this.floorX.min && this.position.x < this.floorX.max && this.position.z > this.floorZ.min && this.position.z < this.floorZ.max ? this.position.y < 0 && (this.spreading = !0, this.dispatchEvent(this.changeEvent), this.spreadPieces()) : this.position.y < -3e3 && this.reset()))
    }, spreadPieces: function () {
        var e, s = this;
        this.water.visible = !1, this.pieceMaterial.opacity = .9, TweenLite.to(this.pieceMaterial, .6, {opacity: 0});
        for (var i = 0, t = this.pieces.length; i < t; i++) {
            e = this.pieces[i];
            var a = Math.cos(e._radian) * e._radius, n = Math.sin(e._radian) * e._radius;
            TweenLite.to(e.position, .6, {x: a, z: n}), TweenLite.to(e.position, .6, {y: e._y, ease: Back.easeOut})
        }
        TweenLite.delayedCall(.6, function () {
            s.spreading = !1, s.water.visible = !0;
            for (var i = 0, t = s.pieces.length; i < t; i++) (e = s.pieces[i]).position.set(0, 0, 0);
            s.reset()
        })
    }, reset: function () {
        this.position.set(CW.Util.random(this.rangeX.min, this.rangeX.max), CW.Util.random(this.rangeY.min, this.rangeY.max), CW.Util.random(this.rangeZ.min, this.rangeZ.max)), this.velocity.set(0, CW.Util.random(-2, -6), 0), this.acceleration.set(0, CW.Util.random(-.08, -.18), 0);
        var i = CW.Util.random(5, 14);
        this.water.scale.set(i, CW.Util.random(10, 20), i)
    }, _init: function () {
        var i = new THREE.BoxBufferGeometry(1, 1, 1);
        i.applyMatrix((new THREE.Matrix4).makeTranslation(0, .5, 0)), this.water = new THREE.Mesh(i, new THREE.MeshBasicMaterial({color: this.dropColor})), this.water.scale.set(10, 50, 10), this.water.castShadow = !0, this.add(this.water);
        for (var t = 0; t < 9; t++) {
            var e = new THREE.Mesh(i, this.pieceMaterial), s = CW.Util.random(10, 30);
            e.scale.set(s, s, s), e._radian = t / 9 * (2 * Math.PI), e._radius = CW.Util.random(50, 100), e._y = CW.Util.random(40, 100), e.rotation.y = CW.Util.random(0, Math.PI / 2), this.add(e), this.pieces.push(e)
        }
    }, show: function () {
        this.visible = !0
    }, hide: function () {
        this.visible = !1
    }, addEventListener: function (i, t) {
        void 0 === this._listeners && (this._listeners = {});
        var e = this._listeners;
        void 0 === e[i] && (e[i] = []), -1 === e[i].indexOf(t) && e[i].push(t)
    }, hasEventListener: function (i, t) {
        if (void 0 === this._listeners) return !1;
        var e = this._listeners;
        return void 0 !== e[i] && -1 !== e[i].indexOf(t)
    }, removeEventListener: function (i, t) {
        if (void 0 !== this._listeners) {
            var e = this._listeners[i];
            if (void 0 !== e) {
                var s = e.indexOf(t);
                -1 !== s && e.splice(s, 1)
            }
        }
    }, dispatchEvent: function (i) {
        if (void 0 !== this._listeners) {
            var t = this._listeners[i.type];
            if (void 0 !== t) {
                i.target = this;
                for (var e = t.slice(0), s = 0, a = e.length; s < a; s++) e[s].call(this, i)
            }
        }
    }
});
CW.RainyFloor = function (e, t) {
    THREE.Object3D.call(this), this.width = e || 600, this.depth = t || 600, this.isRaining = !1, this.floorBox, this.plane, this.planeVertices, this.sortedFaces = [], this.sortedVertices = [], this.centerVectorIdx = -1, this.pillars = [], this._init()
}, CW.RainyFloor.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.RainyFloor, update: function (e) {
        this.isRaining && (e.position.y = e.position.y + .05 * (this.planeVertices[this.centerVectorIdx].y - e.position.y)), this.plane.geometry.elementsNeedUpdate = !0, this.plane.geometry.verticesNeedUpdate = !0
    }, show: function () {
        this._wave();
        var e = this;
        TweenLite.delayedCall(1, function () {
            e._showPillars()
        })
    }, dig: function (e) {
        var n, s = .15, o = this, t = this._getPointsInDistance(e, 100);
        CW.Util.forEach(t, function (e, t) {
            var i = o.plane.geometry.vertices[e.index];
            TweenLite.killTweensOf(i);
            var a = -(100 - Math.max(40, e.distance));
            s += .02, (n = new TimelineLite).to(i, s, {y: a, ease: Back.easeInOut}), n.to(i, .3, {
                y: -a / 2,
                ease: Back.easeOut
            }), n.to(i, .3, {y: 0, ease: Back.easeOut}, "-=0.05")
        })
    }, startRain: function () {
        this.isRaining = !0
    }, stop: function () {
        this.isRaining = !1, CW.Util.forEach(this.pillars, function (e, t) {
            TweenLite.to(e.scale, .8, {
                delay: .2 * t, y: 1, ease: Power1.easeInOut, onComplete: function () {
                    e.visible = !1
                }
            })
        })
    }, showFloorBox: function () {
        this.floorBox.visible = !0
    }, _wave: function () {
        this.plane.visible = !0, CW.Util.forEach(this.sortedFaces, function (e, t) {
            TweenLite.killTweensOf(e);
            var i = .003 * t;
            TweenLite.set(e, {delay: i, materialIndex: 1}), TweenLite.set(e, {
                delay: i + .2,
                materialIndex: 2
            }), TweenLite.set(e, {delay: i + .4, materialIndex: 3}), TweenLite.set(e, {
                delay: i + .5,
                materialIndex: 4
            }), TweenLite.set(e, {delay: i + .6, materialIndex: 5})
        });
        var n = .6;
        CW.Util.forEach(this.sortedVertices, function (e, t) {
            TweenLite.killTweensOf(e);
            var i = -(130 - t / 2);
            n += .01;
            var a = new TimelineLite;
            a.to(e, n, {y: i, ease: Back.easeInOut}), a.to(e, .3, {
                y: -i / 2,
                ease: Back.easeOut
            }), a.to(e, .3, {y: i / 3, ease: Back.easeOut}, "-=0.05"), a.to(e, .2, {y: 0, ease: Back.easeOut}, "-=0.05")
        })
    }, _showPillars: function () {
        CW.Util.forEach(this.pillars, function (e, t) {
            TweenLite.set(e, {delay: .15 * t, visible: !0}), TweenLite.to(e.scale, 2, {
                delay: .15 * t,
                y: 5e3,
                ease: Circ.easeInOut
            })
        })
    }, _init: function () {
        this._createPlane(), this._createPillars(), this._createFloorBox()
    }, _createFloorBox: function () {
        var e = new THREE.BoxBufferGeometry(this.width, 600, this.depth);
        e.applyMatrix((new THREE.Matrix4).makeTranslation(0, -300, 0));
        var t = new THREE.MeshLambertMaterial({color: 7032344});
        this.floorBox = new THREE.Mesh(e, t), this.floorBox.position.y = -2, this.floorBox.visible = !1, this.add(this.floorBox)
    }, _createPlane: function () {
        var a = this, n = new THREE.Vector3,
            e = new THREE.PlaneGeometry(this.width, this.depth, 16, 16).rotateX(-Math.PI / 2);
        this.planeVertices = e.vertices, CW.Util.forEach(this.planeVertices, function (e, t) {
            if (e.x !== -a.width / 2 && e.x !== a.width / 2 && e.z !== -a.depth / 2 && e.z !== a.depth / 2) {
                if (0 === e.x && 0 === e.z) return e._distance = 0, void (a.centerVectorIdx = t);
                e.x += CW.Util.random(-10, 10), e.z += CW.Util.random(-10, 10), e.y += CW.Util.random(-100, 100), e._distance = CW.Util.distanceVector3(n, e)
            } else e._distance = CW.Util.distanceVector3(n, e)
        }), CW.Util.forEach(e.faces, function (e, t) {
            var i = CW.Util.distanceVector3(n, CW.Util.getCenterOfTriangle(a.planeVertices[e.a], a.planeVertices[e.b], a.planeVertices[e.c]));
            e._distance = i
        });
        var t = [new THREE.MeshBasicMaterial({
            color: CW.SceneRainyDay.sceneColor,
            wireframe: !1
        }), new THREE.MeshPhongMaterial({
            flatShading: !0,
            color: 7288398,
            transparent: !0,
            opacity: 1
        }), new THREE.MeshPhongMaterial({
            flatShading: !0,
            color: 6105948,
            transparent: !0,
            opacity: 1
        }), new THREE.MeshPhongMaterial({
            flatShading: !0,
            color: 6307676,
            transparent: !0,
            opacity: 1
        }), new THREE.MeshPhongMaterial({
            flatShading: !0,
            color: 2048332,
            transparent: !0,
            opacity: 1
        }), new THREE.MeshPhongMaterial({flatShading: !0, color: CW.RainyFloor.finalColor})];
        this.plane = new THREE.Mesh(e, t), this.plane.receiveShadow = !0, this.plane.visible = !1, this.add(this.plane), this.sortedFaces = this._getSort(this.plane.geometry.faces.slice(0)), this.sortedVertices = this._getSort(this.plane.geometry.vertices.slice(0))
    }, _createPillars: function () {
        var i = this, a = new THREE.BoxBufferGeometry(1, 1, 1);
        a.applyMatrix((new THREE.Matrix4).makeTranslation(0, -.5, 0));
        var n, s = new THREE.MeshPhongMaterial({flatShading: !0, color: 3428190});
        CW.Util.forEach([[597, 0, -597], [597, 0, 597], [-597, 0, 597]], function (e, t) {
            (n = new THREE.Mesh(a, s)).scale.set(4, 1, 4), n.position.set(e[0], 0, e[2]), n.visible = !1, i.add(n), i.pillars.push(n)
        })
    }, _getPointsInDistance: function (i, a) {
        var n, e = this.plane.geometry.vertices, s = [];
        return CW.Util.forEach(e, function (e, t) {
            (n = CW.Util.distance(i.x, i.z, e.x, e.z)) < a && s.push({index: t, distance: n})
        }), s.sort(function (e, t) {
            var i = 0;
            return e.distance > t.distance ? i = 1 : e.distance < t.distance && (i = -1), i
        })
    }, _getSort: function (e) {
        return e.sort(function (e, t) {
            var i = 0;
            return e._distance > t._distance ? i = 1 : e._distance < t._distance && (i = -1), i
        })
    }
}), CW.RainyFloor.finalColor = "#344f5e";
CW.Ring = function (t) {
    THREE.Object3D.call(this), this.colors = [{firstColor: "#c06c84", finalColor: "#f67280"}, {
        firstColor: "#ffc8c8",
        finalColor: "#f67280"
    }, {firstColor: "#ffc8c8", finalColor: "#f67280"}, {
        firstColor: "#f8b195",
        finalColor: "#ffc8c8"
    }], this.radius = Math.round(CW.Util.random(20, 70)), this.distance = t + this.radius, this.outerGroup, this.innerGroup, this.mesh, this.cycle = -CW.Util.random(.005, .01), this.cycle = -CW.Util.random(.01, .04), this._init()
}, CW.Ring.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Ring, update: function () {
        this.innerGroup.rotation.x += this.cycle, CW.Util.radToDeg(this.innerGroup.rotation.x)
    }, start: function () {
    }, show: function (t) {
        this.outerGroup.position.y = CW.Util.random(-1500, -700), TweenLite.to(this.outerGroup.position, 1.7, {
            y: 0,
            ease: Sine.easeInOut
        });
        var e = .7 + .06 * this.innerGroup.children.length;
        CW.Util.forEach(this.innerGroup.children, function (t, e) {
            t.visible = !0, t.scale.set(1, .01, 1), t.material.transparent = !0, t.material.opacity = 0, TweenLite.set(t.material, {
                transparent: !0,
                opacity: 0,
                visible: !0
            }), TweenLite.to(t.material, .1, {
                delay: .06 * e, opacity: 1, onComplete: function () {
                }
            }), TweenLite.to(t.scale, .7, {delay: .06 * e, y: 1, ease: Power3.easeInOut})
        }), TweenLite.delayedCall(e, function () {
            t && t()
        })
    }, hide: function (i) {
        TweenLite.to(this.outerGroup.position, 2, {
            delay: .1,
            y: -1500,
            ease: Sine.easeInOut
        }), CW.Util.forEach(this.innerGroup.children, function (t, e) {
            TweenLite.to(t.scale, 1, {
                dealy: .03 * e,
                x: 2,
                y: 2,
                z: 2,
                ease: Back.easeInOut
            }), TweenLite.to(t.rotation, 1, {
                dealy: .03 * e,
                x: 0,
                y: 0,
                z: 0,
                ease: Back.easeInOut
            }), TweenLite.to(t.position, 1, {
                delay: .03 * e,
                y: -3e3,
                ease: Back.easeInOut
            }), TweenLite.to(t.material, 1, {
                delay: .5 + .03 * e, opacity: 0, onComplete: function () {
                    t.visible = !1, i && i()
                }
            })
        })
    }, _init: function () {
        this._createOuterGroup(), this._createInnerGroup(), this._createBasic()
    }, _createOuterGroup: function () {
        this.outerGroup = new THREE.Group, this.outerGroup.rotation.z = -1.3, this.add(this.outerGroup)
    }, _createInnerGroup: function () {
        this.innerGroup = new THREE.Group, this.outerGroup.add(this.innerGroup)
    }, _createBasic: function () {
        for (var t, e, i, o, r = this.radius + Math.round(CW.Util.random(300, 400)), n = 0, a = r / Math.floor(2 * Math.PI * this.distance) * 3, s = Math.floor(CW.Util.random(0, this.colors.length)), l = this.colors[s].firstColor, h = this.colors[s].finalColor, c = Math.round(CW.Util.random(10, 40)), u = 0; u < c; u++) t = CW.Util.getColorRgb(l, h, u / c), i = new THREE.CylinderBufferGeometry(this.radius, this.radius, r, 8), 0 !== u && u !== c - 1 || (i = new THREE.SphereBufferGeometry(this.radius, 8, 8)), n += a, e = new THREE.MeshBasicMaterial({color: t}), (o = new THREE.Mesh(i, e)).position.y = Math.sin(n) * this.distance, o.position.z = Math.cos(n) * this.distance, o.visible = !1, this.innerGroup.add(o), o.lookAt(this.position), o.updateMatrix()
    }, _createMerge: function () {
        for (var t, e, i, o, r = Math.round(CW.Util.random(30, 150)), n = r + Math.round(CW.Util.random(100, 200)), a = 0, s = this.radius + Math.floor(CW.Util.random(3e3, 4e3)), l = n / Math.floor(2 * Math.PI * s) * 3, h = Math.floor(CW.Util.random(0, this.colors.length)), c = this.colors[h].firstColor, u = this.colors[h].finalColor, d = Math.round(CW.Util.random(10, 40)), f = new THREE.Geometry, p = [], C = 0; C < d; C++) t = CW.Util.getColorRgb(c, u, C / d), e = new THREE.CylinderGeometry(r, r, n, 8), 0 !== C && C !== d - 1 || (e = new THREE.SphereGeometry(r, 8, 8)), CW.Util.forEach(e.faces, function (t, e) {
            t.materialIndex = C
        }), a += l, i = new THREE.MeshBasicMaterial({color: t}), p.push(i), (o = new THREE.Mesh(e, i)).position.y = Math.sin(a) * s, o.position.z = Math.cos(a) * s, o.lookAt(this.position), o.updateMatrix(), f.merge(o.geometry, o.matrix);
        var y = new THREE.Mesh(f, p);
        this.innerGroup.add(y)
    }
});
CW.Road = function (t, e, i, o) {
    THREE.Object3D.call(this), this.path = t, this.firstColor = e || "#00f260", this.finalColor = i || "#0575e6", this.major = o, this.curve, this.boxes = [], this.posIdx = 0, this.posLength = 1e3, this._init()
}, CW.Road.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Road, update: function () {
    }, dispose: function () {
    }, show: function () {
        var i = 0;
        CW.Util.forEach(this.boxes, function (t, e) {
            TweenLite.set(t, {delay: i, visible: !0}), TweenLite.to(t.scale, .1, {
                delay: i,
                z: t._scale.z,
                ease: Power1.easeInOut
            }), i += .1
        })
    }, hide: function () {
        CW.Util.forEach(this.boxes, function (t, e) {
            TweenLite.to(t.position, 2, {
                delay: .1 * e,
                y: -5e3,
                ease: Power2.easeInOut
            }), TweenLite.to(t.rotation, 2, {delay: .1 * e, y: 1.5 * Math.random(), ease: Power2.easeInOut})
        })
    }, getPoint: function (t) {
        return this.curve.getPoint(t)
    }, along: function (t) {
        if (this.posIdx += 1, this.posIdx >= this.posLength) return !0;
        var e = this.curve.getPoint(this.posIdx / this.posLength),
            i = this.curve.getPoint((this.posIdx + 1) / this.posLength);
        return t.position.copy(e), t.lookAt(i), !1
    }, _init: function () {
        this._createCurve(), this._createBoxes()
    }, _createCurve: function () {
        var i = [];
        CW.Util.forEach(this.path, function (t, e) {
            i.push(new THREE.Vector3(t[0], t[1], t[2]))
        }), this.curve = new THREE.CatmullRomCurve3(i)
    }, _createLine: function () {
        var t = this.curve.getPoints(50), e = (new THREE.BufferGeometry).setFromPoints(t),
            i = new THREE.LineBasicMaterial({color: 0}), o = new THREE.Line(e, i);
        this.add(o)
    }, _createBoxes: function () {
        var t, e, i, o, s, n, r, a, c = CW.Util.random(10, 50);
        this.major ? (c = 200, scaleY = 40) : (c = 150, scaleY = 20);
        var h = new THREE.BoxBufferGeometry(1, 1, 1);
        h.applyMatrix((new THREE.Matrix4).makeTranslation(0, -.5, .5));
        for (var l = 0; l < 30; l++) {
            o = this.curve.getPoint(l / 30), s = this.curve.getPoint((l + 1) / 30), (r = new THREE.Group).position.copy(o), r.lookAt(s), this.add(r), t = l / 30, i = "rgb(" + (e = CW.Util.getColorFromGradient(this.firstColor, this.finalColor, t))[0] + ", " + e[1] + ", " + e[2] + ")";
            var u = new THREE.MeshBasicMaterial({color: i});
            this.major && (u = new THREE.MeshLambertMaterial({color: i})), n = new THREE.Mesh(h, u), r.add(n), a = CW.Util.distanceVector3(r.position, s) + 10, c += 1, n.scale.set(c, scaleY, .01), n._scale = {
                x: c,
                y: scaleY,
                z: a
            }, n.visible = !1, this.major && (n.receiveShadow = !0), this.boxes.push(n)
        }
    }
});
CW.Title = function () {
    THREE.Object3D.call(this), this.STATE = {
        DEFAULT: "DEFAULT",
        SHOW: "SHOW",
        FALLING: "FALLING",
        FALLED: "FALLED"
    }, this.state = this.STATE.DEFAULT, this.text = "Going Home.", this.group, this.boundingBox, this.velocity = new THREE.Vector3, this.acceleration = new THREE.Vector3(0, -.01, 0), this.ACCEL = new THREE.Vector3(0, -.01, 0), this.MIN_Y = -45, this.LIQUID_Y = 30, this.frontFaceIndexes = [], this._init()
}, CW.Title.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Title, update: function () {
        this.state === this.STATE.SHOW ? this.group.children[0].geometry.elementsNeedUpdate = !0 : this.state === this.STATE.FALLING && (this.applyForce(this.ACCEL), this.position.y < this.LIQUID_Y && this.sink(), this.velocity.add(this.acceleration), this.position.add(this.velocity), this.acceleration.setLength(0), this.position.y <= this.MIN_Y && (this.state = this.STATE.FALLED, this.visible = !1, this.dispatchEvent({type: "falled"})))
    }, show: function (e) {
        var t = this;
        this.state = this.STATE.SHOW;
        var i = this.group.children[0], s = i.material[3], n = i.geometry.faces;
        CW.Util.shuffle(this.frontFaceIndexes), CW.Util.forEach(this.frontFaceIndexes, function (e, t) {
            n[e].materialIndex = 3
        }), TweenLite.to(s, 7, {opacity: .55, ease: Sine.easeInOut}), TweenLite.delayedCall(5.1, function () {
            t.state = t.STATE.DEFAULT
        }), TweenLite.delayedCall(5.5, function () {
            e && e()
        })
    }, fall: function () {
        this.state = this.STATE.FALLING, CW.Util.forEach(this.group.children[0].geometry.faces, function (e, t) {
            1 === e.materialIndex && (e.materialIndex = 2)
        }), this.group.children[0].geometry.elementsNeedUpdate = !0;
        var e = this.group.children[0].material[3];
        TweenLite.to(e, .5, {opacity: 1, ease: Sine.easeInOut}), TweenLite.to(this.position, .3, {
            z: 0,
            ease: Circ.easeOut
        }), TweenLite.to(this.position, .3, {
            y: 420,
            ease: Circ.easeOut
        }), (new TimelineMax).addLabel("flip").to(this.rotation, 3, {
            x: -Math.PI / 2,
            ease: Power2.easeOut
        }, "flip").to(this.rotation, 3, {y: .2, ease: Power2.easeOut}, "flip")
    }, sink: function () {
        var e = this.position.y < -10 ? .5 : .16, t = this.velocity.length(), i = e * t * t, s = this.velocity.clone();
        s.multiplyScalar(-1), s.normalize(), s.multiplyScalar(i), this.applyForce(s), this.rotation.y < 0 ? this.rotation.y = 0 : this.rotation.y -= .002
    }, applyForce: function (e) {
        this.acceleration.add(e)
    }, _init: function () {
        this._create(), this.position.set(0, 400, 30)
    }, _create: function () {
        this._createText(), this._createBoundingBox()
    }, _createText: function () {
        var e, t, i, s, n = new THREE.Font(CW.Font.helvetiker_bold_typeface);
        s = [new THREE.MeshBasicMaterial({color: CW.SceneTitle.sceneColor}), new THREE.MeshBasicMaterial({color: CW.SceneTitle.sceneColor}), new THREE.MeshBasicMaterial({color: 1184017}), new THREE.MeshBasicMaterial({
            color: 8483699,
            transparent: !0,
            opacity: .1
        })], (e = new THREE.Group).position.y = 30, this.add(e), (i = new THREE.TextGeometry(this.text, {
            font: n,
            size: 70,
            height: 30,
            curveSegments: 4,
            bevelThickness: 2,
            bevelSize: 1.5,
            bevelEnabled: !1
        })).computeBoundingBox(), i.computeVertexNormals();
        for (var o = 0; o < i.faces.length; o++) {
            var a = i.faces[o];
            if (1 == a.materialIndex) {
                for (var r = 0; r < a.vertexNormals.length; r++) a.vertexNormals[r].z = 0, a.vertexNormals[r].normalize();
                var h = i.vertices[a.a], l = i.vertices[a.b], c = i.vertices[a.c];
                if (210 < THREE.GeometryUtils.triangleArea(h, l, c)) for (r = 0; r < a.vertexNormals.length; r++) a.vertexNormals[r].copy(a.normal)
            }
        }
        var d = -.5 * (i.boundingBox.max.x - i.boundingBox.min.x);
        (t = new THREE.Mesh(i, s)).position.x = d, t.position.z = 0, t.rotation.x = 0, t.rotation.y = 2 * Math.PI, e.add(t), this.group = e;
        var E = this;
        CW.Util.forEach(i.faces, function (e, t) {
            0 === e.materialIndex && E.frontFaceIndexes.push(t)
        })
    }, _createBoundingBox: function () {
        this.boundingBox = new THREE.Mesh(new THREE.BoxBufferGeometry(200, 200, 10), new THREE.MeshBasicMaterial({
            color: 16711680,
            visible: !1
        })), this.boundingBox.position.set(0, 100, 0), this.add(this.boundingBox)
    }, addEventListener: function (e, t) {
        void 0 === this._listeners && (this._listeners = {});
        var i = this._listeners;
        void 0 === i[e] && (i[e] = []), -1 === i[e].indexOf(t) && i[e].push(t)
    }, hasEventListener: function (e, t) {
        if (void 0 === this._listeners) return !1;
        var i = this._listeners;
        return void 0 !== i[e] && -1 !== i[e].indexOf(t)
    }, removeEventListener: function (e, t) {
        if (void 0 !== this._listeners) {
            var i = this._listeners[e];
            if (void 0 !== i) {
                var s = i.indexOf(t);
                -1 !== s && i.splice(s, 1)
            }
        }
    }, dispatchEvent: function (e) {
        if (void 0 !== this._listeners) {
            var t = this._listeners[e.type];
            if (void 0 !== t) {
                e.target = this;
                for (var i = t.slice(0), s = 0, n = i.length; s < n; s++) i[s].call(this, e)
            }
        }
    }
});
CW.TriangleFlag = function () {
    THREE.Object3D.call(this), this.numSegments = 8, this.segments = [], this.segWidth = 10, this.segHeight = 140, this.segDepth = 30, this.cycle = 0, this.flagpole, this.cloths, this._init()
}, CW.TriangleFlag.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.TriangleFlag, update: function () {
        this.cycle += .05;
        for (var t = 0; t < this.numSegments; t++) {
            var s = .9 * -t, e = Math.PI / (30 / (t + 1)), a = Math.sin(this.cycle + s) * e;
            this.segments[t].rotation.y = a
        }
    }, _init: function () {
        this._createCloths(), this._createBar()
    }, _createCloths: function () {
        this.cloths = new THREE.Group, this.cloths.position.y = 440, this.add(this.cloths);
        var t = new THREE.BoxBufferGeometry(this.segWidth, this.segHeight, this.segDepth);
        t.applyMatrix((new THREE.Matrix4).makeTranslation(0, 0, -this.segDepth / 2));
        for (var s = this.cloths, e = 0, a = new THREE.MeshBasicMaterial({color: 16151168}), i = 0; i < this.numSegments; i++) {
            var h = 1.1 - .1 * i, o = t.clone();
            o.applyMatrix((new THREE.Matrix4).makeScale(1, h, 1));
            var r = new THREE.Mesh(o, a);
            r.castShadow = !0, r.receiveShadow = !0, r.position.z = e, s.add(r), s = r, e = 2 - this.segDepth, this.segments.push(s)
        }
    }, _createBar: function () {
        this.flagpole = new THREE.Group, this.add(this.flagpole);
        var t = new THREE.BoxBufferGeometry(1, 1, 1);
        t.applyMatrix((new THREE.Matrix4).makeTranslation(0, .5, 0)), this.barBottom = new THREE.Mesh(t, CW.Util.getGrayBasicMaterial()), this.barBottom.castShadow = !0, this.barBottom.scale.set(20, 20, 20), this.flagpole.add(this.barBottom), this.bar = new THREE.Mesh(t, CW.Util.getGrayBasicMaterial()), this.bar.castShadow = !0, this.bar.scale.set(10, 500, 10), this.bar.position.set(0, 10, 0), this.flagpole.add(this.bar), this.barTop = new THREE.Mesh(t, CW.Util.getGrayBasicMaterial()), this.barTop.castShadow = !0, this.barTop.scale.set(20, 20, 20), this.barTop.position.set(0, 500, 0), this.flagpole.add(this.barTop)
    }
});
CW.Wall = function (e) {
    THREE.Object3D.call(this), this.boxes = [], this.basicMaterial = new THREE.MeshBasicMaterial({
        color: e,
        wireframe: !1
    }), this._init(e)
}, CW.Wall.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Wall, update: function () {
    }, show: function () {
        var e = this.boxes[0], t = e.geometry;
        t.faces.forEach(function (e, t) {
            e.materialIndex = 1, 8 !== t && 9 !== t || (e.materialIndex = 0)
        }), t.elementsNeedUpdate = !0;
        for (var a = 0; a < this.boxes.length; a++) {
            e = this.boxes[a];
            var i = CW.Util.random(.5, 1.5), o = CW.Util.random(0, .15) + .01 * a;
            TweenLite.to(e.rotation, i, {
                delay: o,
                x: Math.PI,
                ease: Back.easeInOut
            }), TweenLite.to(e.position, i, {delay: o, z: CW.Util.random(0, 40), ease: Back.easeInOut})
        }
    }, open: function () {
    }, changeBlack: function (e) {
        this.basicMaterial.color = new THREE.Color(1118481);
        var t = this, a = this.boxes[0].geometry;
        CW.Util.forEach(this.boxes, function (e, t) {
            TweenLite.to(e.position, .5, {z: 0, ease: Power2.easeInOut})
        }), TweenLite.delayedCall(.5, function () {
            a.faces.forEach(function (e, t) {
                e.materialIndex = 0, 10 !== t && 11 !== t || (e.materialIndex = 1)
            }), a.elementsNeedUpdate = !0, CW.Util.forEach(t.boxes, function (e, t) {
                TweenLite.to(e.rotation, 2, {delay: .003 * t, x: 0, ease: Power2.easeInOut})
            })
        }), TweenLite.delayedCall(2.8, function () {
            e && e()
        })
    }, buildTower: function (e) {
        var t = this.boxes[0].geometry;
        t.faces.forEach(function (e, t) {
            e.materialIndex = 0
        }), t.elementsNeedUpdate = !0;
        var n = new THREE.Vector3(0, -200, 900), s = 0;
        CW.Util.forEach(this.boxes, function (e, t) {
            var a = CW.Util.degToRad(10 * t), i = n.x + 900 * Math.cos(a), o = n.z + 900 * Math.sin(a);
            CW.Util.random(.5, 1.5);
            s = .003 * t, TweenLite.to(e.rotation, 1.5, {
                delay: s,
                z: a,
                y: a,
                ease: Back.easeInOut
            }), TweenLite.to(e.position, 1.5, {delay: s, x: i, y: 4 * t, z: o, ease: Back.easeInOut})
        }), TweenLite.delayedCall(1.5 + s, function () {
            e && e()
        })
    }, hide: function (e) {
        var i = new THREE.Vector3(0, 300, 900), o = 0, t = this;
        CW.Util.forEach(this.boxes, function (e, t) {
            var a = CW.Util.degToRad(10 * t);
            i.x, Math.cos(a), i.z, Math.sin(a), CW.Util.random(.5, 1.5);
            o = .003 * t, TweenLite.to(e.rotation, 1.5, {
                delay: o,
                z: 0,
                y: 0,
                ease: Back.easeIn
            }), TweenLite.to(e.position, 1.5, {
                delay: o,
                x: i.x,
                y: i.y,
                z: i.z,
                ease: Back.easeIn
            }), TweenLite.to(e.scale, 1.5, {delay: o, x: .005, y: .01, z: .005, ease: Back.easeIn})
        }), TweenLite.delayedCall(1.5 + o, function () {
            TweenLite.to(t.basicMaterial, .4, {opacity: 0})
        }), TweenLite.delayedCall(1.5 + o, function () {
            e && e()
        })
    }, _init: function (e) {
        var t = 200, a = 100, i = new THREE.BoxGeometry(t, a, t);
        i.faces.forEach(function (e, t) {
            e.materialIndex = 0, 8 !== t && 9 !== t || (e.materialIndex = 0)
        });
        new THREE.MeshBasicMaterial({color: e, wireframe: !1});
        for (var o = new THREE.Vector3(0, 0, 0), n = 0; n < 26; n++) for (var s = 0; s < 35; s++) {
            var r = Math.floor(CW.Util.random(0, 62)), l = CW.Util.getColorFromGradient("#919190", "#ef7b7b", r / 61),
                c = "rgb(" + l[0] + ", " + l[1] + ", " + l[2] + ")", d = n % 2 == 0 ? 50 : 0,
                h = [this.basicMaterial, new THREE.MeshLambertMaterial({flatShading: !0, color: c})],
                f = new THREE.Mesh(i, h);
            f.position.set(s * t - 3400 + d, n * a + 50, 0), f._dist = CW.Util.distanceVector3(f.position, o), this.add(f), this.boxes.push(f)
        }
        this._sort()
    }, _sort: function () {
        var e = this.boxes.sort(function (e, t) {
            var a = 0;
            return e._dist > t._dist ? a = 1 : e._dist < t._dist && (a = -1), a
        });
        this.boxes = e
    }
});
CW.WallKeeper.FootPrint = function () {
    THREE.Object3D.call(this), this.boxes = [], this._init()
}, CW.WallKeeper.FootPrint.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.WallKeeper.FootPrint,
    update: function () {
    },
    show: function (e) {
        for (var t, a = 0, o = 0; o < this.boxes.length; o++) {
            t = this.boxes[o], a = .1 * o, (new TimelineLite).set(t, {
                delay: a + .01,
                visible: !0
            }).addLabel("show").to(t.scale, 1, {
                x: t._scale.x,
                y: t._scale.y,
                z: t._scale.z,
                ease: Back.easeInOut
            }, "show").to(t.rotation, 1, {x: 0, y: 0, ease: Back.easeInOut}, "show").to(t.scale, 1, {
                delay: .05,
                x: .1,
                y: .1,
                z: .1,
                ease: Back.easeInOut
            }).set(t, {visible: !1})
        }
        e && TweenLite.delayedCall(a + 1, function () {
            e()
        })
    },
    _init: function () {
        for (var e, t = new THREE.BoxBufferGeometry(1, 1, 1), a = 1, o = 0, s = 200, i = [30, 30, 30], n = [17, 153, 142], l = 0; l < 20; l++) {
            var c = CW.Util.pickHex(i, n, l / 20), r = "rgb(" + c[0] + ", " + c[1] + ", " + c[2] + ")",
                h = new THREE.MeshBasicMaterial({color: r});
            o = Math.sin(a) * (150 + l * l * .5), (e = new THREE.Mesh(t, h)).scale.set(1, 1, 1), s = 150 - l * l * .3, s = 50, e._scale = {
                x: s,
                y: 20,
                z: 50
            }, e.position.set(0, o, 60 * l), e.rotation.x = CW.Util.random(Math.PI / 2, 2 * Math.PI), e.rotation.y = CW.Util.random(Math.PI / 2, 2 * Math.PI), e.visible = !1, this.add(e), a += .3, this.boxes.push(e)
        }
    }
});

function degToRad(t) {
    return THREE.Math.degToRad(t)
}

CW.Robot.Arm = function (t) {
    THREE.Object3D.call(this), this.STATE = {
        DEFAULT: "DEFAULT",
        STAND: "STAND",
        WALK: "WALK",
        RUN: "RUN",
        TOP: "TOP",
        BOTTOM: "BOTTOM",
        BOTTOM_REACH: "BOTTOM_REACH",
        FRONT: "FRONT"
    }, this.state = this.STATE.DEFAULT, this.isLeft = "left" === t, this.isInverse = !1, this.cycle = this.isLeft ? Math.PI : 0, this.shoulder, this.seg0, this.seg1, this.hand, this.target, this._init(), this.rotation.x = degToRad(5 * Math.cos(this.cycle - .07))
}, CW.Robot.Arm.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Robot.Arm, update: function () {
        switch (this.state) {
            case this.STATE.STAND:
                this.rotation.x = degToRad(5 * Math.cos(this.cycle)), this.cycle += .07;
                break;
            case this.STATE.WALK:
                this.rotation.x = degToRad(14 * Math.cos(this.cycle)), this.cycle += .1;
                break;
            case this.STATE.RUN:
                this.rotation.x = degToRad(30 * Math.cos(this.cycle)), this.cycle += .1;
                break;
            case this.STATE.TOP:
            case this.STATE.BOTTOM:
            case this.STATE.BOTTOM_REACH:
            case this.STATE.FRONT:
                this.rotation.x = degToRad(7 * Math.cos(this.cycle)), this.cycle += .07
        }
    }, actDefault: function () {
        this.state !== this.STATE.DEFAULT && (this.state = this.STATE.DEFAULT, this._killTweens(), this.actBottom(), this.rotation.x = degToRad(5 * Math.cos(this.cycle)))
    }, actStand: function () {
        if (this.state !== this.STATE.STAND) {
            this.state = this.STATE.STAND, this._killTweens(), this.cycle = this.isLeft ? Math.PI : 0, this.rotation.set(0, 0, 0);
            var t = this._onUpdate.bind(this), e = this._getActProps("actBottom");
            TweenLite.to(this.seg0.rotation, .5, {
                x: e.seg0Rot.x,
                y: e.seg0Rot.y,
                z: e.seg0Rot.z
            }), TweenLite.to(this.seg1.rotation, .5, {
                x: e.seg1Rot.x,
                y: e.seg1Rot.y,
                onUpdate: t
            }), TweenLite.to(this.shoulder.rotation, .5, {x: e.seg0Rot.x})
        }
    }, actWalk: function () {
        if (this.state !== this.STATE.WALK) {
            this.state = this.STATE.WALK, this.cycle = this.isLeft ? Math.PI : 0, this._killTweens();
            var t = this._getActProps("actWalk");
            this.seg0.rotation.set(t.seg0Rot.x, t.seg0Rot.y, t.seg0Rot.z), this.seg0.updateMatrixWorld(), this.seg1.position.copy(this.seg0.getPinPosition()), this.seg1.rotation.set(t.seg1Rot.x, t.seg1Rot.y, t.seg1Rot.z), this.seg1.updateMatrixWorld(), this.hand.position.copy(this.seg1.getPinPosition())
        }
    }, actRun: function () {
        if (this.state !== this.STATE.RUN) {
            this.state = this.STATE.RUN, this.cycle = this.isLeft ? Math.PI : 0, this._killTweens();
            var t = this._getActProps("actRun");
            this.seg0.rotation.set(t.seg0Rot.x, t.seg0Rot.y, t.seg0Rot.z), this.seg0.updateMatrixWorld(), this.seg1.position.copy(this.seg0.getPinPosition()), this.seg1.rotation.set(t.seg1Rot.x, t.seg1Rot.y, t.seg1Rot.z), this.seg1.updateMatrixWorld(), this.hand.position.copy(this.seg1.getPinPosition())
        }
    }, actShake: function (t) {
        if (this.state !== this.STATE.TOP) {
            this.state = this.STATE.TOP;
            var e = this._onUpdate.bind(this), s = this._getActProps("actTop");
            TweenLite.to(this.seg0.rotation, .5, {
                x: s.seg0Rot.x,
                y: s.seg0Rot.y,
                z: s.seg0Rot.z
            }), TweenLite.to(this.shoulder.rotation, .5, {x: s.seg0Rot.x}), (new TimelineLite).to(this.seg1.rotation, .5, {
                x: s.seg1Rot.x,
                y: s.seg1Rot.y,
                onUpdate: e
            }).to(this.seg1.rotation, .4, {
                y: s.seg1Rot.y - .4,
                onUpdate: e
            }).to(this.seg1.rotation, .4, {
                y: s.seg1Rot.y + .4,
                onUpdate: e
            }).to(this.seg1.rotation, .4, {
                y: s.seg1Rot.y - .4,
                onUpdate: e
            }).to(this.seg1.rotation, .4, {
                y: s.seg1Rot.y + .4,
                onUpdate: e
            }).to(this.seg1.rotation, .4, {
                y: s.seg1Rot.y - .4,
                onUpdate: e
            }).to(this.seg1.rotation, .4, {
                y: s.seg1Rot.y + .4,
                onUpdate: e
            }).to(this.seg1.rotation, .4, {
                y: s.seg1Rot.y, onUpdate: e, onComplete: function () {
                    t && t()
                }
            })
        }
    }, actTop: function (t) {
        if (this.state !== this.STATE.TOP) {
            this.state = this.STATE.TOP, t = t || 1;
            var e = this._onUpdate.bind(this), s = this._getActProps("actTop");
            TweenLite.to(this.seg0.rotation, t, {
                x: s.seg0Rot.x,
                y: s.seg0Rot.y,
                z: s.seg0Rot.z,
                ease: Sine.easeInOut
            }), TweenLite.to(this.seg1.rotation, t, {
                x: s.seg1Rot.x,
                y: s.seg1Rot.y,
                onUpdate: e,
                ease: Sine.easeInOut
            }), TweenLite.to(this.shoulder.rotation, t, {x: s.seg0Rot.x, ease: Sine.easeInOut})
        }
    }, actBottom: function (t) {
        if (this.state !== this.STATE.BOTTOM) {
            this.state = this.STATE.BOTTOM, this._killTweens(), t = t || 1;
            var e = this._onUpdate.bind(this), s = this._getActProps("actBottom");
            TweenLite.to(this.seg0.rotation, t, {
                x: s.seg0Rot.x,
                y: s.seg0Rot.y,
                z: s.seg0Rot.z,
                ease: Sine.easeInOut
            }), TweenLite.to(this.seg1.rotation, t, {
                x: s.seg1Rot.x,
                y: s.seg1Rot.y,
                onUpdate: e,
                ease: Sine.easeInOut
            }), TweenLite.to(this.shoulder.rotation, t, {x: s.seg0Rot.x, ease: Sine.easeInOut})
        }
    }, actBottomReach: function (t) {
        if (this.state !== this.STATE.BOTTOM_REACH) {
            this.state = this.STATE.BOTTOM_REACH, this._killTweens(), t = t || 1;
            var e = this._onUpdate.bind(this), s = this._getActProps("actRun");
            TweenLite.to(this.seg0.rotation, t, {
                x: s.seg0Rot.x,
                y: s.seg0Rot.y,
                z: s.seg0Rot.z,
                ease: Sine.easeInOut
            }), TweenLite.to(this.seg1.rotation, t, {
                x: s.seg1Rot.x,
                y: s.seg1Rot.y,
                onUpdate: e,
                ease: Sine.easeInOut
            }), TweenLite.to(this.shoulder.rotation, t, {x: s.seg0Rot.x, ease: Sine.easeInOut})
        }
    }, actFront: function () {
        if (this.state !== this.STATE.FRONT) {
            this.state = this.STATE.FRONT, this._killTweens();
            var t = this._onUpdate.bind(this), e = this._getActProps("actFront");
            TweenLite.to(this.seg0.rotation, .5, {
                x: e.seg0Rot.x,
                y: e.seg0Rot.y,
                z: e.seg0Rot.z
            }), TweenLite.to(this.seg1.rotation, .5, {
                x: e.seg1Rot.x,
                y: e.seg1Rot.y,
                z: e.seg1Rot.z
            }), TweenLite.to(this.shoulder.rotation, .5, {x: e.seg0Rot.x, onUpdate: t})
        }
    }, _onUpdate: function () {
        this.seg0.updateMatrixWorld(), this.seg1.position.copy(this.seg0.getPinPosition()), this.seg1.updateMatrixWorld(), this.hand.position.copy(this.seg1.getPinPosition())
    }, _killTweens: function () {
        TweenLite.killTweensOf(this.seg0.rotation), TweenLite.killTweensOf(this.seg1.rotation), TweenLite.killTweensOf(this.rotation), TweenLite.killTweensOf(this.target.position), TweenLite.killTweensOf(this.shoulder.rotation)
    }, _init: function () {
        var t = this._getActProps("actBottom");
        this.shoulder = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(15, 0), new THREE.MeshBasicMaterial({color: 3355443})), this.shoulder.castShadow = !0, this.shoulder.position.y = 4, this.shoulder.rotation.x = t.seg0Rot.x, this.add(this.shoulder), this.seg0 = new CW.Robot.ArmSegment(10, 20, 6), this.add(this.seg0), this.seg1 = new CW.Robot.ArmSegment(10, 40, 10), this.seg1.position.copy(this.seg0.getPinPosition()), this.add(this.seg1), this.hand = new THREE.Mesh(new THREE.DodecahedronBufferGeometry(20, 0), new THREE.MeshBasicMaterial({
            color: 1118481,
            wireframe: !1
        })), this.hand.castShadow = !0, this.hand.position.copy(this.seg1.getPinPosition()), this.add(this.hand), this.target = new CW.Robot.Target, this.target.position.set(-40, -190, 40), this.target.position.set(0, 0, 400), this.target.visible = !1, this.add(this.target), this.seg0.rotation.set(t.seg0Rot.x, t.seg0Rot.y, t.seg0Rot.z), this.seg0.updateMatrixWorld(), this.seg1.position.copy(this.seg0.getPinPosition()), this.seg1.rotation.set(t.seg1Rot.x, t.seg1Rot.y, t.seg1Rot.z), this.seg1.updateMatrixWorld(), this.hand.position.copy(this.seg1.getPinPosition());
        var e = new THREE.Mesh(new THREE.CylinderBufferGeometry(3, 3, 14, 8), new THREE.MeshBasicMaterial({
            color: 2236962,
            wireframe: !1
        }));
        e.castShadow = !0, e.position.set(0, 0, 5), this.seg1.add(e), this.update()
    }, _getActProps: function (t) {
        return (this.isLeft ? CW.Robot.Arm.LEFT : CW.Robot.Arm.RIGHT)[t]
    }
}), CW.Robot.Arm.LEFT = {
    actTop: {
        seg0Rot: {x: degToRad(-90), y: degToRad(70), z: 0},
        seg1Rot: {x: degToRad(-90), y: degToRad(30), z: 0}
    },
    actBottom: {seg0Rot: {x: degToRad(90), y: degToRad(30), z: 0}, seg1Rot: {x: degToRad(90), y: degToRad(10), z: 0}},
    actFront: {seg0Rot: {x: 0, y: degToRad(40), z: 0}, seg1Rot: {x: 0, y: degToRad(20), z: 0}},
    actWalk: {seg0Rot: {x: degToRad(90), y: degToRad(30), z: 0}, seg1Rot: {x: degToRad(90), y: degToRad(20), z: 0}},
    actRun: {seg0Rot: {x: degToRad(90), y: degToRad(70), z: 0}, seg1Rot: {x: degToRad(90), y: degToRad(40), z: 0}}
}, CW.Robot.Arm.RIGHT = {
    actTop: {
        seg0Rot: {x: degToRad(-90), y: degToRad(-70), z: 0},
        seg1Rot: {x: degToRad(-90), y: degToRad(-30), z: 0}
    },
    actBottom: {seg0Rot: {x: degToRad(90), y: degToRad(-30), z: 0}, seg1Rot: {x: degToRad(90), y: degToRad(-10), z: 0}},
    actFront: {seg0Rot: {x: 0, y: degToRad(-40), z: 0}, seg1Rot: {x: 0, y: degToRad(-20), z: 0}},
    actWalk: {seg0Rot: {x: degToRad(90), y: degToRad(-30), z: 0}, seg1Rot: {x: degToRad(90), y: degToRad(-20), z: 0}},
    actRun: {seg0Rot: {x: degToRad(90), y: degToRad(-70), z: 0}, seg1Rot: {x: degToRad(90), y: degToRad(-40), z: 0}}
}, CW.Robot.ArmSegment = function (t, e, s) {
    THREE.Object3D.call(this), this.width = t, this.height = e, this.depth = s, this.body = new THREE.Mesh(new THREE.BoxBufferGeometry(t, e, s).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({
        color: 13421772,
        wireframe: !1
    })), this.body.position.z = this.height / 2, this.add(this.body), this.pin = new THREE.Mesh(new THREE.SphereBufferGeometry(4, 4, 4), new THREE.MeshBasicMaterial({
        color: 0,
        wireframe: !1
    })), this.pin.position.z = this.height - 5, this.pin.visible = !1, this.add(this.pin)
}, CW.Robot.ArmSegment.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Robot.ArmSegment,
    getPinPosition: function () {
        var t = new THREE.Vector3;
        return function () {
            return t.copy(this.pin.position).applyMatrix4(this.matrix)
        }
    }()
});
CW.Robot.Body = function () {
    THREE.Object3D.call(this), this.state = CW.Robot.Body.STATE_DEFAULT, this.cycle = 0, this.width = 40, this.height = 90, this.depth = 40, this.group, this.sphere, this.cylinder, this._init()
}, CW.Robot.Body.STATE_DEFAULT = "default", CW.Robot.Body.STATE_STAND = "stand", CW.Robot.Body.STATE_WALK = "walk", CW.Robot.Body.STATE_RUN = "run", CW.Robot.Body.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Robot.Body, update: function (t) {
        this.state === CW.Robot.Body.STATE_STAND ? (this.group.position.y = 2 * Math.sin(this.cycle), this.cycle += .07) : this.state === CW.Robot.Body.STATE_WALK ? (this.rotation.y = THREE.Math.degToRad(6 * Math.sin(this.cycle)), this.cycle += .1) : this.state === CW.Robot.Body.STATE_RUN && (this.rotation.y = THREE.Math.degToRad(6 * Math.sin(this.cycle)), this.cycle += .15)
    }, actDefault: function () {
        this.state !== CW.Robot.Body.STATE_DEFAULT && (this.state = CW.Robot.Body.STATE_DEFAULT)
    }, actStand: function () {
        this.state !== CW.Robot.Body.STATE_STAND && (this.state = CW.Robot.Body.STATE_STAND)
    }, actWalk: function () {
        this.state !== CW.Robot.Body.STATE_WALK && (this.state = CW.Robot.Body.STATE_WALK)
    }, actRun: function () {
        this.state !== CW.Robot.Body.STATE_RUN && (this.state = CW.Robot.Body.STATE_RUN)
    }, _init: function () {
        this.group = new THREE.Group, this.add(this.group), this.sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(26, 8, 8, 0, Math.PI).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({
            color: 5592405,
            wireframe: !1
        })), this.sphere.castShadow = !0, this.sphere.position.y = 30, this.group.add(this.sphere), this.cylinder = new THREE.Mesh(new THREE.CylinderBufferGeometry(26, 26, 30, 16), new THREE.MeshBasicMaterial({
            color: 5592405,
            wireframe: !1
        })), this.cylinder.castShadow = !0, this.cylinder.position.y = 15, this.group.add(this.cylinder)
    }
});
CW.Robot.DropZone = function (t, i, e, h) {
    THREE.Object3D.call(this), this.name = "dropzone", this.width = t, this.height = i, this.depth = e, this.ft = h, this.material = new THREE.MeshBasicMaterial({color: 16711680}), this._init(), this.hide()
}, CW.Robot.DropZone.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Robot.DropZone,
    update: function () {
    },
    show: function () {
        this.visible = !0
    },
    hide: function () {
        this.visible = !1, this.out()
    },
    over: function () {
        this.material.color.set("#00ff00")
    },
    out: function () {
        this.material.color.set("#ff0000")
    },
    _init: function () {
        var e = this, t = new THREE.BoxBufferGeometry(this.width + 2 * this.ft, this.height, this.ft),
            i = new THREE.BoxBufferGeometry(this.ft, this.height, this.depth),
            h = [{geo: t, x: 0, z: -this.depth / 2 - this.ft / 2}, {
                geo: t,
                x: 0,
                z: this.depth / 2 + this.ft / 2
            }, {geo: i, x: -this.width / 2 - this.ft / 2, z: 0}, {geo: i, x: this.width / 2 + this.ft / 2, z: 0}];
        CW.Util.forEach(h, function (t) {
            var i = new THREE.Mesh(t.geo, e.material);
            i.position.set(t.x, e.height / 2, t.z), e.add(i)
        })
    }
});
CW.Robot.Head = function () {
    THREE.Object3D.call(this), this.WIDTH = 100, this.HEIGHT = 64, this.DEPTH = 64, this.state = CW.Robot.Head.STATE_DEFAULT, this.group, this.target, this.face, this.leftEye, this.rightEye, this.leftEar, this.rightEar, this.cycle = 0, this._init()
}, CW.Robot.Head.STATE_DEFAULT = "default", CW.Robot.Head.STATE_CHASE = "chase", CW.Robot.Head.STATE_SHAKE = "shake", CW.Robot.Head.STATE_SHAKE_SIDE = "shake side", CW.Robot.Head.STATE_TURN = "turn", CW.Robot.Head.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Robot.Head, update: function () {
        switch (this.state) {
            case CW.Robot.Head.STATE_DEFAULT:
            case CW.Robot.Head.STATE_CHASE:
                break;
            case CW.Robot.Head.STATE_SHAKE:
                this.group.rotation.z = THREE.Math.degToRad(5 * Math.cos(this.cycle)), this.cycle += .05;
                break;
            case CW.Robot.Head.STATE_SHAKE_SIDE:
                this.group.rotation.y = THREE.Math.degToRad(20 * Math.cos(this.cycle)), this.cycle += .02
        }
    }, actDefault: function () {
        this.state !== CW.Robot.Head.STATE_DEFAULT && (this.state = CW.Robot.Head.STATE_DEFAULT, TweenLite.killTweensOf(this.group.rotation), TweenLite.to(this.group.rotation, .5, {
            x: 0,
            y: 0,
            z: 0,
            ease: Power1.easeInOut
        }))
    }, actChase: function (t) {
        this.state !== CW.Robot.Head.STATE_CHASE && (this.state = CW.Robot.Head.STATE_CHASE)
    }, actTurn: function (t, e) {
        if (t) {
            e = e || 1;
            var i = this;
            TweenLite.to(this.target.position, e, {
                x: t.x, y: t.y, z: t.z, onUpdate: function () {
                    i.group.lookAt(i.target.position)
                }
            })
        }
    }, actShake: function () {
        this.state !== CW.Robot.Head.STATE_SHAKE && (this.state = CW.Robot.Head.STATE_SHAKE, this.cycle = 0)
    }, actShakeSide: function () {
        this.state !== CW.Robot.Head.STATE_SHAKE_SIDE && (this.state = CW.Robot.Head.STATE_SHAKE_SIDE, this.cycle = 0)
    }, raise: function (t, e) {
        e = e || 1, t = Math.max(0, Math.min(t, 90));
        var i = CW.Util.degToRad(-t);
        TweenLite.killTweensOf(this.rotation.x), TweenLite.to(this.rotation, e, {x: i, ease: Sine.easeInOut})
    }, lower: function (t, e) {
        e = e || 1, t = Math.max(0, Math.min(t, 90));
        var i = CW.Util.degToRad(t);
        TweenLite.killTweensOf(this.rotation.x), TweenLite.to(this.rotation, e, {x: i, ease: Sine.easeInOut})
    }, ahead: function (t) {
        t = t || 1, TweenLite.killTweensOf(this.rotation.x), TweenLite.to(this.rotation, t, {
            x: CW.Util.degToRad(-10),
            ease: Sine.easeInOut
        })
    }, turnLeft: function (t, e) {
        e = e || 1, t = Math.max(0, Math.min(t, 90));
        var i = CW.Util.degToRad(t);
        TweenLite.killTweensOf(this.group.rotation.x), TweenLite.to(this.group.rotation, e, {
            y: i,
            ease: Sine.easeInOut
        })
    }, turnRight: function (t, e) {
        e = e || 1, t = Math.max(0, Math.min(t, 90));
        var i = CW.Util.degToRad(-t);
        TweenLite.killTweensOf(this.group.rotation.x), TweenLite.to(this.group.rotation, e, {
            y: i,
            ease: Sine.easeInOut
        })
    }, turnFront: function (t) {
        t = t || 1, TweenLite.killTweensOf(this.group.rotation.x), TweenLite.to(this.group.rotation, t, {
            y: 0,
            ease: Sine.easeInOut
        })
    }, _init: function () {
        this.group = new THREE.Group, this.add(this.group), this._createTarget(), this._createFace(), this._createEyes(), this._createEars(), this.lookAt(this.target.position)
    }, _createFace: function () {
        this.face = new THREE.Mesh(new THREE.BoxBufferGeometry(this.WIDTH, this.HEIGHT, this.DEPTH), new THREE.MeshLambertMaterial({
            color: 15658734,
            wireframe: !1
        })), this.face.castShadow = !0, this.face.position.set(0, this.HEIGHT / 2, 0), this.group.add(this.face)
    }, _createEyes: function () {
        var t = new THREE.CylinderBufferGeometry(13, 13, 15, 10);
        t.rotateX(Math.PI / 2);
        var e = new THREE.MeshBasicMaterial({color: 3355443, wireframe: !1});
        this.leftEye = new THREE.Mesh(t, e), this.leftEye.castShadow = !0, this.leftEye.position.set(23, this.HEIGHT - 34, this.DEPTH / 2), this.group.add(this.leftEye), this.rightEye = new THREE.Mesh(t, e), this.rightEye.castShadow = !0, this.rightEye.position.set(-23, this.HEIGHT - 34, this.DEPTH / 2), this.group.add(this.rightEye)
    }, _createEars: function () {
        var t = new THREE.BoxBufferGeometry(15, 20, 10), e = new THREE.MeshBasicMaterial({color: 5592405});
        this.leftEar = new THREE.Mesh(t, e), this.leftEar.castShadow = !0, this.leftEar.position.set(this.WIDTH / 2, this.HEIGHT / 2, 0), this.group.add(this.leftEar), this.rightEar = new THREE.Mesh(t, e), this.rightEar.castShadow = !0, this.rightEar.position.set(-this.WIDTH / 2, this.HEIGHT / 2, 0), this.group.add(this.rightEar)
    }, _createTarget: function () {
        this.target = new CW.Robot.Target, this.target.position.set(0, 30, 200), this.target.visible = !1
    }
});
CW.Robot.HeadAndNeck = function () {
    THREE.Object3D.call(this), this.head = null, this.neck = null, this.target, this._init()
}, CW.Robot.HeadAndNeck.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Robot.HeadAndNeck, update: function () {
        this.head.update()
    }, actShake: function () {
        this.head.actShake()
    }, actTurn: function (t, e, i) {
        this.head.actTurn(new THREE.Vector3(t, e, i))
    }, actSayGoodBye: function () {
        var t = this;
        TweenLite.killTweensOf(this.target), this.target.set(0, this.position.y, 100), TweenLite.to(this.target, 1, {
            x: 0,
            y: 100,
            ease: Sine.easeInOut,
            onUpdate: function () {
                t.head.lookAt(t.target)
            }
        })
    }, actDefault: function () {
        TweenLite.to(this.head.rotation, 1, {x: 0, y: 0, z: 0, ease: Sine.easeInOut})
    }, actRotateRight: function () {
        var t = this;
        TweenLite.killTweensOf(this.target.position), TweenLite.to(this.target.position, 1, {
            x: -300,
            y: this.neck.HEIGHT,
            onUpdate: function () {
                t.head.lookAt(t.target.position)
            }
        })
    }, actRotateLeft: function () {
        var t = this;
        TweenLite.killTweensOf(this.target.position), TweenLite.to(this.target.position, 1, {
            x: 300,
            y: this.neck.HEIGHT,
            onUpdate: function () {
                t.head.lookAt(t.target.position)
            }
        })
    }, actRotateTop: function () {
        var t = this;
        TweenLite.killTweensOf(this.target), log(this.position), this.target.set(0, this.position.y, 100), TweenLite.to(this.target, 1, {
            x: 0,
            y: 150,
            onUpdate: function () {
                t.head.lookAt(t.target)
            }
        })
    }, actRotateBottom: function () {
        var t = this;
        TweenLite.killTweensOf(this.target.position), TweenLite.to(this.target.position, 1, {
            x: 0,
            y: 0,
            onUpdate: function () {
                t.head.lookAt(t.target.position)
            }
        })
    }, _init: function () {
        this.neck = new CW.Robot.Neck, this.add(this.neck), this.head = new CW.Robot.Head, this.head.position.set(0, this.neck.HEIGHT, 0), this.add(this.head), this.target = new THREE.Vector3
    }
});
CW.Robot.Leg = function (t) {
    THREE.Object3D.call(this), this.isLeft = "left" === t, this.isInverse = !0, this.state = CW.Robot.Leg.STATE_STAND, this.seg0, this.seg1, this.foot, this.target, this.cycle = 0, this._init()
}, CW.Robot.Leg.STATE_STAND = "stand", CW.Robot.Leg.STATE_WALK = "walk", CW.Robot.Leg.STATE_RUN = "run", CW.Robot.Leg.LEFT = {}, CW.Robot.Leg.RIGHT = {}, CW.Robot.Leg.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Robot.Leg, update: function () {
        this.state === CW.Robot.Leg.STATE_WALK ? (this._walk(this.seg0, this.seg1, this.cycle), this.foot.position.copy(this.seg1.getPinPosition()), this.foot.rotation.copy(this.seg1.rotation), this.cycle += .07) : this.state === CW.Robot.Leg.STATE_RUN && (this._run(this.seg0, this.seg1, this.cycle), this.foot.position.copy(this.seg1.getPinPosition()), this.foot.rotation.copy(this.seg1.rotation), this.cycle += .07)
    }, actStand: function () {
        var t = this;
        this.state = CW.Robot.Leg.STATE_STAND, this._killTweens(), TweenLite.to(this.seg0.rotation, .5, {
            x: 0,
            y: 0,
            z: 0,
            onUpdate: function () {
                t.seg0.updateMatrixWorld(), t.seg1.position.copy(t.seg0.getPinPosition())
            }
        }), TweenLite.to(this.seg1.rotation, .5, {
            x: 0, y: 0, z: 0, onUpdate: function () {
                t.seg1.updateMatrixWorld()
            }
        }), TweenLite.to(this.foot.rotation, .5, {
            x: 0, y: 0, z: 0, onUpdate: function () {
                t.seg1.updateMatrixWorld(), t.foot.position.copy(t.seg1.getPinPosition())
            }
        })
    }, actWalk: function () {
        this.state = CW.Robot.Leg.STATE_WALK, this.cycle = 0, this.isLeft && (this.cycle += Math.PI), this._killTweens()
    }, actRun: function () {
        this.state = CW.Robot.Leg.STATE_RUN, this.cycle = 0, this.isLeft && (this.cycle += Math.PI), this._killTweens()
    }, _walk: function (t, i, o) {
        var e = -Math.PI / 2, s = 30 * Math.sin(o), n = 30 * Math.sin(o + e) + 20;
        t.rotation.x = THREE.Math.degToRad(s), i.rotation.x = t.rotation.x + THREE.Math.degToRad(n), t.updateMatrixWorld(), i.position.copy(t.getPinPosition()), i.updateMatrixWorld()
    }, _run: function (t, i, o) {
        var e = -Math.PI / 2, s = 60 * Math.sin(o), n = 45 * Math.sin(o + e) + 45;
        t.rotation.x = THREE.Math.degToRad(s), i.rotation.x = t.rotation.x + THREE.Math.degToRad(n), t.updateMatrixWorld(), i.position.copy(t.getPinPosition()), i.updateMatrixWorld()
    }, _killTweens: function () {
        TweenLite.killTweensOf(this.seg0.rotation), TweenLite.killTweensOf(this.seg1.rotation), TweenLite.killTweensOf(this.foot.rotation)
    }, _init: function () {
        this.seg0 = new CW.Robot.LegSegment(15, 30, 15), this.add(this.seg0), this.seg1 = new CW.Robot.LegSegment(22, 50, 22), this.seg1.position.copy(this.seg0.getPinPosition()), this.add(this.seg1), this.seg1.updateMatrixWorld(), this.foot = new THREE.Object3D;
        var t = new THREE.Mesh(new THREE.BoxBufferGeometry(40, 14, 60), new THREE.MeshBasicMaterial({
            color: 3355443,
            wireframe: !1
        }));
        t.position.set(0, -10, 10), this.foot.position.copy(this.seg1.getPinPosition()), this.foot.add(t), this.add(this.foot), this.update()
    }
}), CW.Robot.LegSegment = function (t, i, o) {
    THREE.Object3D.call(this), this.width = t, this.height = i, this.depth = o, this.body = new THREE.Mesh(new THREE.BoxBufferGeometry(t, i, o), new THREE.MeshBasicMaterial({
        color: 14540253,
        wireframe: !1
    })), this.body.position.y = -this.height / 2, this.add(this.body), this.pin = new THREE.Mesh(new THREE.SphereBufferGeometry(4, 4, 4), new THREE.MeshBasicMaterial({
        color: 0,
        wireframe: !1
    })), this.pin.position.y = 5 - this.height, this.add(this.pin)
}, CW.Robot.LegSegment.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Robot.LegSegment,
    getPinPosition: function () {
        var t = new THREE.Vector3;
        return function () {
            return t.copy(this.pin.position).applyMatrix4(this.matrix)
        }
    }()
});
CW.Robot.LowerBody = function () {
    THREE.Object3D.call(this), this.HEAP_POSITION_Y = -3, this.state = CW.Robot.STATE_DEFAULT, this.cycle = 0, this.heap, this.leg, this.wheel, this._init()
}, CW.Robot.LowerBody.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Robot.LowerBody, update: function () {
        this.state === CW.Robot.STATE_STAND ? (this.heap.position.y = this.HEAP_POSITION_Y + 1 * Math.sin(this.cycle), this.cycle += .06) : this.state === CW.Robot.STATE_WALK ? (this.heap.position.y = this.HEAP_POSITION_Y + 1 * Math.sin(this.cycle), this.cycle += .1) : this.state === CW.Robot.STATE_RUN && (this.heap.position.y = this.HEAP_POSITION_Y + 1 * Math.sin(this.cycle), this.cycle += .15), this.wheel.update()
    }, actDefault: function () {
        this.state !== CW.Robot.STATE_DEFAULT && (this.state = CW.Robot.STATE_DEFAULT, this.heap.position.y = this.HEAP_POSITION_Y, this.wheel.actDefault())
    }, actStand: function () {
        this.state !== CW.Robot.STATE_STAND && (this.state = CW.Robot.STATE_STAND, this.wheel.actStand())
    }, actWalk: function () {
        this.state !== CW.Robot.STATE_WALK && (this.state = CW.Robot.STATE_WALK, this.wheel.actWalk())
    }, actRun: function () {
        this.state !== CW.Robot.STATE_RUN && (this.state = CW.Robot.STATE_RUN, this.wheel.actRun())
    }, _init: function () {
        this.leg = new THREE.Group, this.leg.position.y = -20, this.add(this.leg), this._createHeap(), this._createVerticalBars(), this.wheel = new CW.Robot.Wheel, this.wheel.position.set(0, -60, 0), this.leg.add(this.wheel)
    }, _createHeap: function () {
        var t = new THREE.BoxBufferGeometry(30, 30, 20);
        t.applyMatrix((new THREE.Matrix4).makeTranslation(0, -15, 0)), this.heap = new THREE.Mesh(t, new THREE.MeshBasicMaterial({color: 7829367})), this.heap.castShadow = !0, this.heap.position.set(0, 0, 0), this.add(this.heap);
        var e = new THREE.DodecahedronBufferGeometry(7, 0), s = new THREE.MeshBasicMaterial({color: 2236962}),
            i = new THREE.Mesh(e, s);
        i.castShadow = !0, i.position.set(-18, -22, 0), this.heap.add(i);
        var a = new THREE.Mesh(e, s);
        a.castShadow = !0, a.position.set(18, -22, 0), this.heap.add(a)
    }, _createVerticalBars: function () {
        var t = new THREE.CylinderBufferGeometry(3, 3, 58, 8);
        t.applyMatrix((new THREE.Matrix4).makeTranslation(0, -29, 0));
        var e = new THREE.MeshBasicMaterial({color: 13421772}), s = new THREE.Mesh(t, e);
        s.castShadow = !0, s.position.set(-18, -5, 0), this.leg.add(s);
        var i = new THREE.Mesh(t, e);
        i.castShadow = !0, i.position.set(18, -5, 0), this.leg.add(i)
    }
});
CW.Robot.Neck = function () {
    THREE.Object3D.call(this), this.WIDTH = 10, this.HEIGHT = 20, this.DEPTH = 10, this._init()
}, CW.Robot.Neck.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Robot.Neck,
    update: function () {
    },
    _init: function () {
        var t = new THREE.Mesh(new THREE.BoxBufferGeometry(this.WIDTH, this.HEIGHT + 20, this.DEPTH), new THREE.MeshBasicMaterial({color: 3355443}));
        t.castShadow = !0, t.position.set(0, this.HEIGHT / 2, 0), this.add(t)
    }
});
CW.Robot.Part = function (t) {
    THREE.Object3D.call(this), this.name = t, this.isAssembled = !1, this.attachedFloor = !1, this.isFirstCollideFloor = !1, this.mass = Math.floor(CW.Util.random(20, 100)), this.velocity = new THREE.Vector3, this.acceleration = new THREE.Vector3, this._origin, this._box, this.outerGroup, this.innerGroup, this._init()
}, CW.Robot.Part.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Robot.Part, update: function () {
        this.isAssembled || (this.velocity.add(this.acceleration), this.position.add(this.velocity), this.acceleration.setLength(0))
    }, reset: function () {
        TweenLite.to(this.rotation, .6, {
            x: 0,
            y: 0,
            z: 0,
            ease: Power1.easeInOut
        }), TweenLite.to(this.outerGroup.rotation, .6, {
            x: 0,
            y: 0,
            z: 0,
            ease: Power1.easeInOut
        }), TweenLite.to(this.innerGroup.rotation, .6, {x: 0, y: 0, z: 0, ease: Power1.easeInOut})
    }, applyForce: function (t) {
        if (!this.isAssembled) {
            var o = t.clone().divideScalar(this.mass);
            this.acceleration.add(o)
        }
    }, checkFloor: function () {
        var t = this;
        this.isAssembled || this.position.y < 10 && (this.position.y = 10, this.velocity.y *= -1, this.velocity.y *= .2, this.isFirstCollideFloor || (this.isFirstCollideFloor = !0, (new TimelineMax).to(this.outerGroup.rotation, .6, {
            x: .14,
            z: .09,
            ease: Power2.easeOut
        }).to(this.outerGroup.rotation, .8, {
            x: -.09,
            z: -.04,
            ease: Power2.easeInOut
        }).to(this.outerGroup.rotation, .6, {
            x: .04,
            z: .03,
            ease: Power1.easeInOut
        }).to(this.outerGroup.rotation, .5, {
            x: 0, z: 0, ease: Power1.easeInOut, onComplete: function () {
                t.attachedFloor = !0
            }
        })))
    }, addOrigin: function (t) {
        this._origin = t, this._originPosY = t.position.y, this.innerGroup.add(t)
    }, addBox: function (t) {
        (t._parent = this)._box = t, this.innerGroup.add(t)
    }, assemble: function () {
        this.isAssembled = !0
    }, _init: function () {
        this.outerGroup = new THREE.Group, this.innerGroup = new THREE.Group, this.add(this.outerGroup), this.outerGroup.add(this.innerGroup), this.outerGroup.rotation.x = -.7, this.outerGroup.rotation.z = -.3
    }
});
CW.Robot.Target = function () {
    THREE.Object3D.call(this), this.cycle = 0, this._init()
}, CW.Robot.Target.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Robot.Target,
    update: function (t) {
        this.cycle += t, this.position.x = 200 * Math.cos(this.cycle), this.position.y = 200 * Math.sin(this.cycle), this.position.z = 200 * Math.sin(this.cycle)
    },
    _init: function () {
        var t = new THREE.Mesh(new THREE.SphereBufferGeometry(4, 10, 10), new THREE.MeshBasicMaterial({color: 16711680}));
        this.add(t)
    }
});
CW.Robot.Wheel = function () {
    THREE.Object3D.call(this), this.cycle = 0, this._init()
}, CW.Robot.Wheel.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
    constructor: CW.Robot.Wheel, update: function () {
        this.state === CW.Robot.STATE_WALK ? (this.rotation.x += .03, this.rotation.z = THREE.Math.degToRad(4 * Math.cos(this.cycle)), this.cycle += .03) : this.state === CW.Robot.STATE_RUN && (this.rotation.x += .08, this.rotation.z = THREE.Math.degToRad(7 * Math.cos(this.cycle)), this.cycle += .05)
    }, actDefault: function () {
        this.state !== CW.Robot.STATE_DEFAULT && (this.state = CW.Robot.STATE_DEFAULT)
    }, actStand: function () {
        this.state !== CW.Robot.STATE_STAND && (this.state = CW.Robot.STATE_STAND)
    }, actWalk: function () {
        this.state !== CW.Robot.STATE_WALK && (this.state = CW.Robot.STATE_WALK)
    }, actRun: function () {
        this.state !== CW.Robot.STATE_RUN && (this.state = CW.Robot.STATE_RUN)
    }, _init: function () {
        this._createWheel(), this._createBar()
    }, _createWheel: function () {
        this.torus = new THREE.Mesh(new THREE.TorusBufferGeometry(34, 10, 8, 19).rotateY(Math.PI / 2), new THREE.MeshBasicMaterial({
            color: 1118481,
            wireframe: !1
        })), this.torus.castShadow = !0, this.add(this.torus);
        var t = new THREE.Mesh(new THREE.CylinderBufferGeometry(10, 10, 20, 8).rotateZ(Math.PI / 2), new THREE.MeshBasicMaterial({color: 5592405}));
        t.castShadow = !0, this.add(t);
        for (var e = new THREE.CylinderBufferGeometry(2, 2, 70, 8), o = 0; o < 6; o++) {
            var a = new THREE.Mesh(e.clone().rotateX(o / 6 * (2 * Math.PI)), new THREE.MeshBasicMaterial({color: 13421772}));
            a.castShadow = !0, this.add(a)
        }
    }, _createBar: function () {
        var t = new THREE.Mesh(new THREE.CylinderBufferGeometry(6, 6, 30, 8).rotateZ(Math.PI / 2), new THREE.MeshBasicMaterial({
            color: 2236962,
            wireframe: !1
        }));
        t.castShadow = !0, t.position.set(0, 0, 0);
        var e = new THREE.Mesh(new THREE.DodecahedronBufferGeometry(8, 0), new THREE.MeshBasicMaterial({
            color: 3355443,
            wireframe: !1
        }));
        e.castShadow = !0, e.position.x = 18, t.add(e);
        var o = e.clone();
        o.castShadow = !0, o.position.x = -18, t.add(o), this.add(t)
    }
});