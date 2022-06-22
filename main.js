if (!Detector.webgl) Detector.addGetWebGLMessage();
var defaultSize = 1024

var isMobile = false;
var deleteIcon =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
var rightSide;
var leftSide;
var centerSide;
var backSide;
var svgPrintable;
var jpgLayoutThumbnail;
var canvasToImages = [];
var fonts = [
  "Arial",
  "Arial Black",
  "Comic Sans MS",
  "Courier",
  "Didot",
  "Georgia",
  "Helvetica",
  "Impact",
  "Lucida Console",
  "MMA-Champ",
  "Tahoma",
  "Times New Roman",
  "Trebuchet MS",
  "Verdana ",
];

var svgGroup = [];
var container, stats, controls;
var camera, scene, renderer, light, material, materialCount;
var selectedMaterial = "ZONE_x28_base_x29_";
var selectedText = "TEXT(team-name)";
var animations = [];
var newText = [];
var manager = new THREE.LoadingManager();
var mixers = [];
var object;
var operand1, operand2, operator1, operator2, solution, question, answer;
var textureLoader, map, textureMaterial;
var mesh;
var materials = [];
var geometries = [];
var alignTolerance = 1;
var pixelRatio = window.devicePixelRatio;
var width = window.innerWidth;
var height = window.innerHeight;
if (width < 992) {
  $("#desktopNav").hide();
  $("#mobileNav").show();
} else {
  $("#desktopNav").show();
  $("#mobileNav").hide();
}
$(window).resize(function (e) {
  if (e.target.width < 992) {
    $("#desktopNav").hide();
    $("#mobileNav").show();
  } else {
    $("#desktopNav").show();
    $("#mobileNav").hide();
  }
});
var textArray = [];
var lines = {
  top: null,
  left: null,
  right: null,
  bottom: null,
};
var canvas = new fabric.Canvas("canvas", {
  preserveObjectStacking: true,
  selection: false,
});

var jerseyName;
var texture = new THREE.Texture(document.getElementById("canvas"));

var canvasTexture = new THREE.CanvasTexture(document.getElementById("canvas"));
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var onClickPosition = new THREE.Vector2();
var raycastContainer;
var zoom = 1;
var patternLists = ["pattern1", "pattern2", "pattern3", "pattern4"];

if (width < height) {
  height = width;
}
/**
 * Fabricjs
 * @type {fabric}
 */
canvas.backgroundColor = "#FFBE9F";

function loadSvg(patternNumber) {
  backColor()
  if (canvas._objects[0] != undefined) {
    fabric.loadSVGFromURL(
      "assets/design/pattern/pattern" + patternNumber + ".svg",
        function (objects, options) {
          var svgData = fabric.util.groupSVGElements(objects, {
            width: defaultSize,
            height: defaultSize,
            selectable: false,
            crossOrigin: "anonymous",
          });
          svgData.top = 0;
          svgData.left = 0;
          svgGroup = svgData;
          canvas.remove(canvas._objects[0]);
          canvas.add(svgData);
          canvas.sendToBack(svgData);
          loadColorsName();
        }
      );
    } else {
      fabric.loadSVGFromURL(
        "assets/design/pattern/pattern" + patternNumber + ".svg",
        function (objects, options) {
          var svgData = fabric.util.groupSVGElements(objects, {
          width: defaultSize,
          height: defaultSize,
          selectable: false,
          crossOrigin: "anonymous",
        });
        svgData.top = 0;
        svgData.left = 0;
        svgGroup = svgData;
        canvas.add(svgData);
        canvas.sendToBack(svgData);
        loadColorsName();
      }
    );
  }
}

function addText(text) {
  if (text != "") {
    jerseyName = new fabric.IText(text, {
      fontSize: 30,
      textAlign: "center",
      fontWeight: "bold",
      left: 100,
      top: 280,
      originX: "center",
      originY: "center",
      selectable: true,
      editable: false,
      centeredScaling: true,
    });
    canvas.add(jerseyName);
    canvas.setActiveObject(jerseyName);
    textContainer();
    $(".text-form").each(function () {
      this.reset();
    });
  }
}

function addText2(text, left, top) {
  if (text != "") {
    jerseyName = new fabric.IText(text, {
      fontSize: 30,
      textAlign: "center",
      fontWeight: "bold",
      left: left,
      top: top,
      originX: "center",
      originY: "center",
      strokeWidth: 0,
      selectable: true,
      editable: false,
      centeredScaling: true,
    });
    canvas.add(jerseyName);
    canvas.setActiveObject(jerseyName);
    textContainer();
    $(".text-form").each(function () {
      this.reset();
    });
    addTextEnable = false;
  }
}

function addLabel(label, leftPos, topPos) {
  if (label != "") {
    labelName = new fabric.IText(label, {
      fontSize: 15,
      textAlign: "center",
      left: leftPos,
      top: topPos,
      originX: "center",
      originY: "center",
      selectable: false,
    });
    canvas.add(labelName);
  }
}
init();
loadSvg("1");

function init() {
  raycastContainer = document.getElementById("renderer");

  container = document.createElement("div");
  document.getElementById("container").appendChild(container);

  scene = new THREE.Scene();
  var screen_rate = width / height;

  camera = new THREE.PerspectiveCamera(30, screen_rate, 100, 1200);

  camera.position.set(500, 0, 0);
  if (window.innerWidth < 768) {
    camera.fov = 10;
    camera.updateProjectionMatrix();
  }
  scene.add(camera);
  controls = new THREE.OrbitControls(camera, container);
  controls.minDistance = 200;
  controls.minZoom = 200;
  controls.maxDistance = 700;
  controls.maxZoom = 700;
  controls.update();
  var light, materials;
  scene.add(new THREE.AmbientLight(0x777777));

  var lights = [
    {
      color: 0xffffff,
      intensity: 0.35,
      position: { x: -500, y: 320, z: 500 },
      lookAt: { x: 0, y: 0, z: 0 },
    },
    {
      color: 0xffffff,
      intensity: 0.15,
      position: { x: 200, y: 50, z: 500 },
      lookAt: { x: 0, y: 0, z: 0 },
    },
    {
      color: 0xffffff,
      intensity: 0.25,
      position: { x: 0, y: 100, z: -500 },
      lookAt: { x: 0, y: 0, z: 0 },
    },
    {
      color: 0xffffff,
      intensity: 0.15,
      position: { x: 1, y: 0, z: 0 },
      lookAt: { x: 0, y: 0, z: 0 },
    },
    {
      color: 0xffffff,
      intensity: 0.15,
      position: { x: -1, y: 0, z: 0 },
      lookAt: { x: 0, y: 0, z: 0 },
    },
  ];
  lights.forEach(function (light) {
    var dlight = new THREE.DirectionalLight(light.color, light.intensity);
    var p = light.position;
    var l = light.lookAt;
    dlight.position.set(p.x, p.y, p.z);
    dlight.lookAt(l.x, l.y, l.z);
    if (light.angle) {
    }
    scene.add(dlight);
  });
  object = new THREE.Object3D();
  light = new THREE.DirectionalLight(0xffffff, 0.2);
  light.position.set(500, 100, 80);
  light.castShadow = true;
  light.shadow.mapSize.width = defaultSize;
  light.shadow.mapSize.height = defaultSize;
  var d = 300;
  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;
  light.shadow.camera.far = 100;
  light.shadowDarkness = 0.5;
  light.shadowCameraVisible = true;
  scene.add(light);
  textureLoader = new THREE.TextureLoader();
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("renderer"),
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);

  container.appendChild(renderer.domElement);
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.soft = true;
  loadObj();
  window.addEventListener("resize", onWindowResize, false);
  loadStyles();
  animate();
}
var img = document.createElement("img");
img.src = deleteIcon;

function deleteObject(eventData, transform) {
  var target = transform.target;
  var canvas = target.canvas;
  if (target.text == undefined) {
    imageContainer();
    console.log(canvas.getActiveObject());
  } else {
    // console.log(target);
    $(".textEditContainer").hide();
    $(".textCreateContainer").show();
  }
  canvas.remove(transform.target);
  canvas.requestRenderAll();
  imageContainer();
  $(".textCreateContainer").show();
  $(".textEditContainer").hide();
  textContainer();
}

function renderIcon(ctx, left, top, styleOverride, fabricObject) {
  var size = this.cornerSize;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
  ctx.drawImage(img, -size / 4, -size / 4, size, size);
  ctx.restore();
}

function initPatch() {
  /**
   * Fabric.js patch
   */
  // fabric.Object.prototype.controls.deleteControl = new fabric.Control({
  //     x: 0.5,
  //     y: -0.5,
  //     offsetY: 0,
  //     cursorStyle: "pointer",
  //     mouseUpHandler: deleteObject,
  //     render: renderIcon,
  //     cornerSize: 24,
  // });
  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerColor = "blue";
  fabric.Object.prototype.cornerStyle = "square";
  if (isMobile == true) {
    fabric.Object.prototype.cornerSize = 15;
  } else {
    fabric.Object.prototype.cornerSize = 12;
  }
  fabric.Canvas.prototype.getPointer = function (e, ignoreZoom) {
    if (this._absolutePointer && !ignoreZoom) {
      return this._absolutePointer;
    }
    if (this._pointer && ignoreZoom) {
      return this._pointer;
    }
    var simEvt;
    if (e.touches != undefined) {
      simEvt = new MouseEvent(
        {
          touchstart: "mousedown",
          touchmove: "mousemove",
          touchend: "mouseup",
        }[e.type],
        {
          bubbles: true,
          cancelable: true,
          view: window,
          detail: 1,
          screenX: Math.round(e.changedTouches[0].screenX),
          screenY: Math.round(e.changedTouches[0].screenY),
          clientX: Math.round(e.changedTouches[0].clientX),
          clientY: Math.round(e.changedTouches[0].clientY),
          ctrlKey: false,
          altKey: false,
          shiftKey: false,
          metaKey: false,
          button: 0,
          relatedTarget: null,
        }
      );
      var pointer = fabric.util.getPointer(simEvt),
        upperCanvasEl = this.upperCanvasEl,
        bounds = upperCanvasEl.getBoundingClientRect(),
        boundsWidth = bounds.width || 0,
        boundsHeight = bounds.height || 0,
        cssScale;
    } else {
      var pointer = fabric.util.getPointer(e),
        upperCanvasEl = this.upperCanvasEl,
        bounds = upperCanvasEl.getBoundingClientRect(),
        boundsWidth = bounds.width || 0,
        boundsHeight = bounds.height || 0,
        cssScale;
    }
    if (!boundsWidth || !boundsHeight) {
      if ("top" in bounds && "bottom" in bounds) {
        boundsHeight = Math.abs(bounds.top - bounds.bottom);
      }
      if ("right" in bounds && "left" in bounds) {
        boundsWidth = Math.abs(bounds.right - bounds.left);
      }
    }
    this.calcOffset();
    pointer.x = Math.round(pointer.x) - this._offset.left;
    pointer.y = Math.round(pointer.y) - this._offset.top;
    /* BEGIN PATCH CODE */
    if (e.target !== this.upperCanvasEl) {
      var positionOnScene;
      if (isMobile == true) {
        positionOnScene = getPositionOnScene(raycastContainer, simEvt);
        if (positionOnScene) {
          // console.log(simEvt.type);
          pointer.x = positionOnScene.x;
          pointer.y = positionOnScene.y;
        }
      } else {
        positionOnScene = getPositionOnScene(raycastContainer, e);
        if (positionOnScene) {
          // console.log(e.type);
          pointer.x = positionOnScene.x;
          pointer.y = positionOnScene.y;
        }
      }
    }
    /* END PATCH CODE */
    if (!ignoreZoom) {
      pointer = this.restorePointerVpt(pointer);
    }

    if (boundsWidth === 0 || boundsHeight === 0) {
      cssScale = { width: 1, height: 1 };
    } else {
      cssScale = {
        width: upperCanvasEl.width / boundsWidth,
        height: upperCanvasEl.height / boundsHeight,
      };
    }

    return {
      x: pointer.x * cssScale.width,
      y: pointer.y * cssScale.height,
    };
  };
}
raycastContainer.addEventListener("mousedown", onMouseClick, false);

if (
  /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
    navigator.userAgent
  ) ||
  /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
    navigator.userAgent.substr(0, 4)
  )
) {
  isMobile = true;
  raycastContainer.removeEventListener("mousedown", onMouseClick, false);
  raycastContainer.addEventListener("touchstart", onTouch, false);
}
/**
 * Other methods
 */
var clicked;
var addTextEnable = false;

function enableAddText(text) {
  if ($("#newText").val() == "") {
    alert("Text cannot be empty");
    return;
  }
  $("#renderer").css("z-index", "9999999");
  $(".styleContainer").css("display", "block");
  $("#textInfo").css("z-index", "9999999");
  $("#textInfo").css("display", "block");
  $("body").css("cursor", "copy");
  addTextEnable = true;
  newText.push(text);
  canvas.on("mouse:down", function (e) {
    if (addTextEnable) {
      if (e.target._objects != undefined) {
        addText2(newText.at(-1), getUv.x * (defaultSize - 40), getUv.y * (defaultSize - 20));
        $("#renderer").css("z-index", "1");
        $(".styleContainer").css("display", "none");
        $("#textInfo").css("display", "none");
        $("body").css("cursor", "default");
        $(".textCreateContainer").hide();
        $(".textEditContainer").show();
        $("#tab2").parent().addClass("active");
        $("#tab3").parent().removeClass("active");
        $("#tab4").parent().removeClass("active");
        $("#tab1").parent().removeClass("active");
        $(".textContainer").addClass("active");
        $("#tabs-4").removeClass("active");
        $("#tabs-3").removeClass("active");
        $("#tabs-2").addClass("active");
        $("#tabs-1").removeClass("active");
        textEditContainer();
        addTextEnable = false;
      }
    }
  });
}
canvas.on("object:modified", function (e) {
  $("#inputHeight").val(e.target.scaleY);
  $("#inputWidth").val(e.target.scaleX);
});
canvas.on("mouse:down", function (e) {
  // console.log(e.target);
  if (e.target._objects == undefined) {
    controls.enabled = false;
    if (e.target._text) {
      textEditContainer();
      $(".textCreateContainer").hide();
      $(".bitmapEditContainer").hide();
      $(".textEditContainer").show();
      $("#tab2").parent().addClass("active");
      $("#tab3").parent().removeClass("active");
      $("#tab4").parent().removeClass("active");
      $("#tab1").parent().removeClass("active");
      $(".textContainer").addClass("active");
      $("#tabs-4").removeClass("active");
      $("#tabs-3").removeClass("active");
      $("#tabs-2").addClass("active");
      $("#tabs-1").removeClass("active");
      $(".bitmapContainer").show();
    } else {
      bitmapEditContainer();
      $(".bitmapContainer").hide();
      $(".bitmapEditContainer").show();
      $(".textCreateContainer").show();
      $(".textEditContainer").hide();
      $("#tab3").parent().addClass("active");
      $("#tab2").parent().removeClass("active");
      $("#tab4").parent().removeClass("active");
      $("#tab1").parent().removeClass("active");
      $("#tabs-4").removeClass("active");
      $("#tabs-3").addClass("active");
      $("#tabs-2").removeClass("active");
      $("#tabs-1").removeClass("active");
    }
  } else {
    controls.enabled = true;
    $(".bitmapEditContainer").hide();
    $(".textCreateContainer").show();
    $(".bitmapContainer").show();
    $(".textEditContainer").hide();
  }
});
canvas.on("object:rotating", function (options) {
  options.target.snapAngle = 15;
});

function onMouseClick(evt) {
  evt.preventDefault();
  const positionOnScene = getPositionOnScene(raycastContainer, evt);
  if (positionOnScene) {
    const canvasRect = canvas._offset;
    const simEvt = new MouseEvent(evt.type, {
      clientX: canvasRect.left + positionOnScene.x,
      clientY: canvasRect.top + positionOnScene.y,
    });
    canvas.upperCanvasEl.dispatchEvent(simEvt);
  }
}

function onTouch(evt) {
  evt.preventDefault();
  const positionOnScene = getPositionOnSceneTouch(raycastContainer, evt);
  if (positionOnScene) {
    const canvasRect = canvas._offset;
    const simEvt = new MouseEvent(evt.type, {
      clientX: canvasRect.left + positionOnScene.x,
      clientY: canvasRect.top + positionOnScene.y,
    });
    canvas.upperCanvasEl.dispatchEvent(simEvt);
  }
}

function getRealPosition(axis, value) {
  let CORRECTION_VALUE = axis === "x" ? 5.5 : 4.5;
  return Math.round(value * defaultSize) - CORRECTION_VALUE + 5;
}
var getUv;

function getPositionOnScene(sceneContainer, evt) {
  var array = getMousePosition(sceneContainer, evt.clientX, evt.clientY);
  onClickPosition.fromArray(array);
  var intersects = getIntersects(onClickPosition, object.children);
  if (intersects.length > 0 && intersects[0].uv) {
    var uv = intersects[0].uv;
    getUv = uv;
    intersects[0].object.material.map.transformUv(uv);
    var circle = new fabric.Circle({
      radius: 3,
      left: getRealPosition("x", uv.x),
      top: getRealPosition("y", uv.y),
      fill: "white",
    });
    // canvas.add(circle);
    return {
      x: getRealPosition("x", uv.x),
      y: getRealPosition("y", uv.y),
    };
  }
  return null;
}

function getPositionOnSceneTouch(sceneContainer, evt) {
  var array = getMousePosition(
    sceneContainer,
    evt.changedTouches[0].clientX,
    evt.changedTouches[0].clientY
  );
  onClickPosition.fromArray(array);
  var intersects = getIntersects(onClickPosition, object.children);
  if (intersects.length > 0 && intersects[0].uv) {
    var uv = intersects[0].uv;
    getUv = uv;
    intersects[0].object.material.map.transformUv(uv);
    var circle = new fabric.Circle({
      radius: 3,
      left: getRealPosition("x", uv.x),
      top: getRealPosition("y", uv.y),
      fill: "white",
    });
    // canvas.add(circle);
    getUv = uv;
    return {
      x: getRealPosition("x", uv.x),
      y: getRealPosition("y", uv.y),
    };
  }
  return null;
}
var getMousePosition = function (dom, x, y) {
  var rect = dom.getBoundingClientRect();
  return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
};

var getIntersects = function (point, objects) {
  mouse.set(point.x * 2 - 1, -(point.y * 2) + 1);
  raycaster.setFromCamera(mouse, camera);
  return raycaster.intersectObjects(objects);
};

var Source_Patterns = ["pattern1", "pattern2", "pattern3", "pattern4", "pattern5", "pattern6", "pattern7", "pattern8", "pattern9", "pattern10", "pattern11", "pattern12", "pattern13", "pattern14"]

function loadColorsName() {
  var data;
  var materialContainer = "";
  for (let i = 0; i < svgGroup._objects.length; i++) {
    if (svgGroup._objects[i].id != "Layer_1") {
      data = svgGroup._objects[i].id.split("ZONE_x28_")[1].split("_x29_")[0];
      // var selected = selectedMaterial == svgGroup._objects[i].id ? "active" : "";
      materialContainer +=
        `<div style="justify-content: space-between;align-items:center;margin: 5px auto;" id="mat_` +
        data +
        `" class="xixcust">
        <div style="display: flex;justify-content: space-between;align-items:center;">
        <div style="width:100px;margin-right:10px;"><input type="text" id="` +
        svgGroup._objects[i].id +
        `" value="` +
        svgGroup._objects[i].fill +
        `"/></div><span style="text-transform:capitalize;" class="egseas">` +
        data +
        `</span>
        </div>
        <div style="display: flex;justify-content: space-between;align-items:center; flex-direction: columum;">
          <div class="pattern-content" style="background-image: url(./assets/design/color/none.svg)" onclick="patternPicker('${svgGroup._objects[i].id}')"></div>
          <span style="text-transform:capitalize;" class="egseas">Pattern</span>
        </div>
        </div>
        <script>
          colorPicker('` +
        svgGroup._objects[i].id +
        `','` +
        svgGroup._objects[i].fill +
        `');
        </script>`;
    }
  }
  $(".materials").empty();
  $("#inputMaterialsColor").css(`display`, `none`);
  $(".materials").append(materialContainer).html();
  if ($(".textCreateContainer")[0].innerHTML.trim() == "") {
    textContainer();
    // bitmapContainer();
    imageContainer();
  } else {
  }
}

function patternPicker(id) {
  var patternContainer = ''
  patternContainer += `<div class="backBtn" onClick="backColor()">Back</div>`
  Source_Patterns.forEach(pattern => {
    patternContainer += `<div class="pattern-wrap">
      <div class="pattern-select" style="background-image: url(./assets/design/color/${pattern}.svg)" onclick="onPatternSelect('${id}', '${pattern}')"></div>
      <label>${pattern}</label>
    </div>`
  });
  
  $('.materials').hide()
  $('.patternContainer').show()
  $('.patternContainer').empty().append(patternContainer)
}

function backColor() {
  $('.materials').show()
  $('.patternContainer').empty()
  $('.patternContainer').hide()
}

function onPatternSelect(id, patternName) {
  svgGroup._objects.forEach((obj) => {
    if(obj.id === id) {
      fabric.util.loadImage("assets/design/color/" + patternName + ".svg",
        function (patterns, options) {
          obj.set("fill", new fabric.Pattern({
            source: patterns,
            repeat: "repeat"
          }))
          canvas.renderAll();
          var definId = 'mat_' + id.split("ZONE_x28_")[1].split("_x29_")[0]
          $(`#${definId}`).find(".pattern-content").css('background-image', 'url(./assets/design/color/' + patternName + '.svg)')
          $(`#${definId}`).find(".sp-preview-inner").css('background-color', 'rgba(0, 0, 0, 0)')
        })
        // function(img) {
        //   // img.scaleToWidth(100)
        //   var patternSourceCanvas = new fabric.StaticCanvas()
        //   patternSourceCanvas.add(img)
        //   patternSourceCanvas.renderAll()
        //   obj.set("fill", new fabric.Pattern({
        //     source: patternSourceCanvas.getElement(),
        //     repeat: 'repeat'
        //   }))
        // })
    }
  })
}

function colorPicker(id, color) {
  $("#" + id).spectrum({
    type: "color",
    color: color,
    showButtons: false,
    move: function (e) {
      svgGroup._objects.forEach((obj) => {
        if (obj.id == id) {
          // console.log("changed");
          obj.set("fill", e.toHexString());
          canvas.renderAll();

          var definId = 'mat_' + id.split("ZONE_x28_")[1].split("_x29_")[0]
          $(`#${definId}`).find(".pattern-content").css('background-image', 'url(./assets/design/color/none.svg)')
        }
      });
    },
  });
  $("#" + id).change(function (e) {});
}

function imageContainer() {
  var imageForm = `
    <form class="form-group" id="uploadImg" runat="server">
        <input type="file" class="form-control" id="uploadedImg" accept="image/*"/>
		</form>
  `;
  var imageLayer = "";
  var id = 0;
  var array = canvas._objects.filter(function (el) {
    return el._element != undefined;
  });
  array.map((object, i) => {
    imageLayer +=
      `<ul class="listsOfImages" style="padding :0;">
        <li class="buttonLists" style="margin:5px 0px;">
        <span>` +
      [i + 1] +
      `. Logo ` +
      [i + 1] +
      `</span>
        <div>
          <i class="fas fa-edit" style="margin:0px 5px;" onclick="getImageById(` +
      i +
      `)"></i>
          <i class="fas fa-trash-alt" style="margin:0px 5px;" onclick="removeImageById(` +
      i +
      `)"></i>
        </div>
      </li>
      </ul>
    `;
  });
  // $(".bitmapContainer")
  //   .empty()
  //   .append(imageForm + imageLayer);
  // document
  //   .getElementById("uploadedImg")
  //   .addEventListener("change", function (e) {
  //     handleImage(e);
  //   });
}

function scaleDownImage() {
  var shouldCenterOrigin =
    (canvas.getActiveObject().originX !== "center" ||
      canvas.getActiveObject().originY !== "center") &&
    true;
  if (shouldCenterOrigin) {
    canvas.getActiveObject()._setOriginToCenter();
  }
  canvas.getActiveObject().scaleX -= 0.01;
  canvas.getActiveObject().scaleY -= 0.01;
  if (shouldCenterOrigin) {
    canvas.getActiveObject()._resetOrigin();
  }
  canvas.renderAll();
}

function scaleUpImage() {
  var shouldCenterOrigin =
    (canvas.getActiveObject().originX !== "center" ||
      canvas.getActiveObject().originY !== "center") &&
    true;
  if (shouldCenterOrigin) {
    canvas.getActiveObject()._setOriginToCenter();
  }
  canvas.getActiveObject().scaleX += 0.01;
  canvas.getActiveObject().scaleY += 0.01;
  if (shouldCenterOrigin) {
    canvas.getActiveObject()._resetOrigin();
  }
  canvas.renderAll();
}

function rotateLeftImage() {
  var shouldCenterOrigin =
    (canvas.getActiveObject().originX !== "center" ||
      canvas.getActiveObject().originY !== "center") &&
    true;
  if (shouldCenterOrigin) {
    canvas.getActiveObject()._setOriginToCenter();
  }
  canvas.getActiveObject().angle -= 15;
  if (shouldCenterOrigin) {
    canvas.getActiveObject()._resetOrigin();
  }
  canvas.renderAll();
}

function rotateRightImage() {
  var shouldCenterOrigin =
    (canvas.getActiveObject().originX !== "center" ||
      canvas.getActiveObject().originY !== "center") &&
    true;
  if (shouldCenterOrigin) {
    canvas.getActiveObject()._setOriginToCenter();
  }
  canvas.getActiveObject().angle += 15;
  if (shouldCenterOrigin) {
    canvas.getActiveObject()._resetOrigin();
  }
  canvas.renderAll();
}

function bitmapEditContainer() {
  var imageList = `
        <div class="row mb-3" style="padding: 0 1rem;">
            <a onclick="scaleDownImage()" class="col-3 btn btn-outline-secondary">-</a>
            <div class="col-6" style="display:flex;justify-content:center;align-items:center;">Scale</div>
            <a onclick="scaleUpImage()" class="col-3 btn btn-outline-secondary">+</a>
        </div>
        <div class="row" style="padding: 0 1rem;">
            <a onclick="rotateLeftImage()" class="col-3 btn btn-outline-secondary">-</a>
            <div class="col-6" style="display:flex;justify-content:center;align-items:center;">Rotation</div>
            <a onclick="rotateRightImage()" class="col-3 btn btn-outline-secondary">+</a>
        </div>
    `;
  console.log(canvas.getActiveObject());
  $(".bitmapEditContainer").empty().append(imageList);
}

function bitmapContainer(e) {
  var uploadForm = `
		<form class="form-inline my-2" id="uploadImg" runat="server">
			<input type="file" id="uploadedImg" accept="image/*"/>
		</form>
	`;
  $(".bitmapContainer").append(uploadForm).html();
  document
    .getElementById("uploadedImg")
    .addEventListener("change", function (e) {
      handleImage(e);
    });
  if (e == "removed") {
    imageContainer();
  }
}

function colorTextWheel(id) {
  $("#textFill_" + id).spectrum({
    color: canvas.getActiveObject().fill,
    showInput: false,
    type: "color",
    move: function (e) {
      canvas.getActiveObject().set("fill", e.toHexString());
      canvas.renderAll();
    },
  });
  $("#textFill_" + id).show();
}

function strokeTextWheel(id) {
  $("#textStroke_" + id).spectrum({
    color: canvas.getActiveObject().stroke,
    showInput: false,
    type: "color",
    move: function (e) {
      canvas.getActiveObject().set("stroke", e.toHexString());
      canvas.renderAll();
    },
  });
  $("#textStroke_" + id).show();
}

function textEditContainer() {
  var textLayer = "";
  var id = 0;
  var obj = canvas.getActiveObject();
  textLayer =
    `
    <script>
      colorTextWheel(` +
    id +
    `);   
        strokeTextWheel(` +
    id +
    `);   
    </script>
    <form>
        <div class="form-row">
          <div class="form-group col-9">
            <label for="inputText">Text</label>
              <input type="text" class="form-control"id="inputText" placeholder="Name, number etc" oninput="changeText(` +
    id +
    `,this)" type="text" value=` +
    obj.text +
    `>
          </div>
          <div class="form-group col-3">
        <input style="display: none; !important;opacity:0;" class="col-12" value="` +
    obj.fill +
    `" onchange="changeTextColor(textFill_` +
    id +
    `.value)"  id="textFill_` +
    id +
    `">
          </div>
        </div>
        <div class="form-row">
        <div class="form-group col-6">
          <label for="inputOutlineWidth">Stroke Width</label>
          <input type="number" onchange="changeOutlineWidth(inputOutlineWidth.value)" class="form-control" id="inputOutlineWidth" min="0" max="3" step="0.1" placeholder="Font size" value="` +
    obj.strokeWidth +
    `" >
        </div>
        <div class="form-group col-6">
          <label for="textStroke_` +
    id +
    `">Stroke Color</label>
          <input style="display:none;opacity:0;" class="col-12" value="` +
    obj.fill +
    `" onchange="changeTextStrokeColor(textStroke_` +
    id +
    `.value)"  id="textStroke_` +
    id +
    `">
        <script>$('#textStroke_0').hide();</script>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="inputFontSize">Font size</label>
          <input type="number" onchange="changeFontSize(inputFontSize.value)" class="form-control" id="inputFontSize" placeholder="Font size" value="` +
    obj.fontSize +
    `" >
        </div>
        <div class="form-group col-md-6">
          <label for="selectFont">Font family</label>
          <select class="form-control" id="selectFont" style="margin-right:5px;"  onchange="changeFont(value)">` +
    fonts.map((font) => {
      if (obj.fontFamily == font) {
        return (
          `
                  <option selected value="` +
          obj.fontFamily +
          `">` +
          obj.fontFamily +
          `</option>
                  `
        );
      } else {
        return (
          `<option style="font-family: ` +
          font +
          `" value="` +
          font +
          `">` +
          font +
          `</option>`
        );
      }
    }) +
    `</select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="inputWidth">Width</label>
          <input type="number" onchange="changeScale(inputWidth.value)" class="form-control" id="inputWidth" placeholder="Width" value="` +
    obj.scaleX +
    `" >
        </div>
        <div class="form-group col-md-6">
          <label for="inputHeight">Height</label>
          <input type="number" onchange="changeScale(inputHeight.value)" class="form-control" id="inputHeight" placeholder="Height" value="` +
    obj.scaleY +
    `" >
        </div>
      </div>
    </form>
  
  `;
  $(".textEditContainer").empty().append(textLayer);
}

function textContainer(e, color) {
  var textForm = `
		<form onsubmit="return false" class="form-inline my-2 text-form row" style="display:flex; justify-content:space-around;padding:0 1rem;">
			<input class="col-md-7 col-12 form-control mr-sm-2" type="text" id="newText"
				placeholder="Name, Number etc" required>
			<button class="col-md-4 col-12 btn btn-outline-primary my-2 my-sm-0" type="button" style="border-color:#47a447; color:#47a447;"
				onclick="enableAddText(newText.value)" data-toggle="modal" data-target="#myModal">Add Text</button>
		</form>
	`;
  var textLayer = "";
  var id = 0;
  canvas._objects.map((object) => {
    if (object.text != undefined) {
      id += 1;
      textLayer +=
        `
			<ul class="listTexts" style="padding :0;">
				<li id="text-` +
        id +
        `" class="buttonLists">
          <span style="justify-content:center;align-items: center;display: flex;">` +
        id +
        `. ` +
        object.text +
        `</span><i class="fas fa-trash" style="margin:0px 5px;color:` +
        object.fill +
        `;" onclick="removeTextLayerById(` +
        id +
        `)" ></i>
					</div>
				</li>
			</ul>
			`;
    }
  });
  $(".textCreateContainer")
    .empty()
    .append(textForm + textLayer);
}

function changeScale(value) {
  // console.log(typeof value);
  $("#inputWidth").val(value);
  $("#inputHeight").val(value);
  canvas.getActiveObject().set("scaleX", value);
  canvas.getActiveObject().set("scaleY", value);
  canvas.renderAll();
}

function changeFont(font) {
  canvas.getActiveObject().fontFamily = font;
  canvas.renderAll();
}

function modalSave() {
  canvas.discardActiveObject().renderAll();
}

function imgsUpload(imgObj, scale) {
  var image = new fabric.Image(imgObj);
  image.set({
    angle: 0,
    padding: 5,
    left: 550,
    top: 700,
    scaleX: scale,
    scaleY: scale,
    cornersize: 10,
    selectable: true,
    centeredScaling: true,
    centeredRotation: true,
  });
  canvas.add(image);
  canvas.setActiveObject(image);
  // console.log(canvasToImages);
  canvas.renderAll();
  $("#uploadImg").each(function () {
    this.reset();
  });
}

function openModal(material) {
  if (material != "") {
    loadColors(material);
    $("#id-findModal").modal();
  } else {
    $("#id-findModal").modal();
  }
}
var imageName = [];
var logos = [];

function uploadImages(event, file) {
  var imgObj = new Image();
  if (imageName == "") {
    imageName = [file.name.replace(/\.[^/.]+$/, "")];
  } else {
    imageName.push(file.name.replace(/\.[^/.]+$/, ""));
  }
  imgObj.src = event.target.result;
  logos.push(imgObj.src);
  imgObj.onload = function (e) {
    if (e.path[0].width >= 500) {
      imgsUpload(imgObj, 0.2);
    } else if (e.path[0].width <= 500) {
      imgsUpload(imgObj, 0.4);
    }
    imageContainer();
    bitmapEditContainer();
    $(".bitmapEditContainer").show();
    $(".bitmapContainer").hide();
  };
}

function listsOfImages(e, i) {
  console.log(e, i);
  var listUploaded = "";
  var id = 0;
  console.log(canvas._objects);
  canvas._objects.map((object) => {
    if (object._element != undefined) {
      id += 1;
      listUploaded +=
        `<ul class="listsOfImages" style="padding :0;">
          <li onclick="getImageById(` +
        id +
        `)" class="buttonLists" style="margin:5px 0px;">
            <span>` +
        id +
        `. ` +
        imageName[id - 1] +
        `</span>
            <div>
              <i class="fas fa-trash-alt" style="margin:0px 5px;" onclick="removeImageById(` +
        id +
        `)"></i>
            </div>
          </li>
        </ul>
      `;
    }
  });
  $(".listsOfImages").empty().append(listUploaded);
}

function getImageById(id) {
  var array = canvas._objects.filter(function (el) {
    return el._element != undefined;
  });
  canvas.setActiveObject(array[id]);
  $(".bitmapEditContainer").show();
  $(".bitmapContainer").hide();
  canvas.renderAll();
}

function removeImageById(id) {
  var array = canvas._objects.filter(function (el) {
    return el._element != undefined;
  });
  canvas.remove(array[id]);
  canvasToImages.splice(0, 1);
  // console.log(canvasToImages);
  $(".listsOfImages").empty();
  imageContainer();
  canvas.renderAll();
}

function getTextLayerById(textName, id) {
  if (textName != null) {
    var colorContainer = "<h3>Colors " + textName + "</h3>";
    colors.forEach(function (color) {
      colorContainer +=
        '<div class="colaz" onClick="changeTextColor(\'' +
        id +
        "'" +
        ",'" +
        color +
        '\')" style="background:' +
        color +
        ';"></div>';
    });
    $(".text-color-picker").show();
    $(".text-color-palete").empty();
    $(".text-color-palete").append(colorContainer).html();
    $(".text-editor").hide();
    $(".text-color-palete").show();
    openModal("");
  }
}

function changeText(id, e) {
  // console.log(e.value);
  var array = canvas._objects.filter(function (el) {
    return el.text != null;
  });
  canvas.getActiveObject().text = e.value;
  canvas.renderAll();
}
var colorChange;

function changeFontSize(value) {
  canvas.getActiveObject().set("fontSize", Number(value));
  canvas.renderAll();
}

function changeOutlineWidth(value) {
  canvas.getActiveObject().set("strokeWidth", Number(value));
  canvas.renderAll();
}

function changeTextColor(value) {
  canvas.getActiveObject().set("fill", value);
  canvas.renderAll();
}

function changeTextStrokeColor(value) {
  canvas.getActiveObject().set("stroke", value);
  canvas.renderAll();
}

function removeTextLayerById(id) {
  canvas.remove(canvas.getObjects()[id]);
  textContainer();
  canvas.renderAll();
}

function handleImage(e) {
  var reader = new FileReader();
  reader.onload = function (event) {
    uploadImages(event, e.target.files[0]);
  };
  reader.readAsDataURL(e.target.files[0]);
}

function inRange(val1, val2) {
  if (Math.max(val1, val2) - Math.min(val1, val2) <= alignTolerance) {
    return true;
  } else {
    return false;
  }
}

function loadColors(material) {
  var colorContainer = "<h3>Colors " + material + "</h3>";
  colors.forEach(function (color) {
    colorContainer +=
      '<div class="colaz" onClick="changeColor(\'' +
      material +
      "'" +
      ",'" +
      color +
      '\')" style="background:' +
      color +
      ';"></div>';
  });
  $(".color-palete").empty();
  $(".color-palete").append(colorContainer).html();
}

function selectMaterial(material, color, id) {
  canvas.renderAll();
  selectedMaterial = id;
  loadColorsName();
}

function loadObj() {
  const textureLoader = new THREE.TextureLoader();
  canvasTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  // const normalMap = textureLoader.load("assets/pattern.jpg");
  textureMaterial = new THREE.MeshPhongMaterial({
    map: canvasTexture,
    combine: 1,
  });
  texture.needsUpdate = true;
  var loader = new THREE.OBJLoader2(manager);
  loader.load(
    "assets/objects/test.obj",
    function (data) {
      if (object != null) {
        scene.remove(object);
      }
      object = null;
      object = data.detail.loaderRootNode;
      materials = [];
      object.traverse(function (child) {
        if (child.isMesh) {
          child.material.map = textureMaterial;
        }
      });
      object.children[0].material = textureMaterial;
      render();
      var scale = height / 5;
      object.scale.set(scale, scale, scale);
      object.position.set(0, -scale * 0.2, 0);
      if (window.innerWidth < 768) {
        object.position.set(0, -scale * 0.3, 0);
      }
      object.rotation.set(0, Math.PI / 2, 0);
      object.receiveShadow = true;
      object.castShadow = true;
      canvas.on("after:render", function () {
        object.children[0].material.map.needsUpdate = true;
      });
      scene.add(object);
    },
    function (xhr) {
      // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    }
  );
}

function loadStyles() {
  var listPatternStyle = "";
  patternLists.forEach((style) => {
    let number = style.split("pattern")[1];
    listPatternStyle =
      `
			<button  style="border-radius: 5px;overflow: hidden;border: 1px solid #47a447;margin: 5px;background: transparent;padding: 0;" class="` +
      style +
      ` btn btn-outline-basic" onclick="loadSvg(` +
      number +
      `)"><img width="100" src="assets/design/thumbnail/` +
      style +
      `.jpg"/></button>
		`;
    $(".styles").append(listPatternStyle).html();
  });
}

function onWindowResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  if (width < height) {
    height = width;
  }
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
  initPatch();
}

function render() {
  renderer.render(scene, camera);
}
async function back() {
  camera.position.x = -500;
  camera.position.y = 0;
  camera.position.z = 0;
  // console.log("back");
}
async function left() {
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = -500;
  // console.log("left");
}
async function right() {
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 500;
  // console.log("right");
}
async function center() {
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 500;
}
async function center2() {
  camera.position.x = 500;
  camera.position.y = 0;
  camera.position.z = 0;
}
async function reset() {
  controls.reset();
}

function b64ToUint8Array(b64Image) {
  var img = atob(b64Image.split(",")[1]);
  var img_buffer = [];
  var i = 0;
  while (i < img.length) {
    img_buffer.push(img.charCodeAt(i));
    i++;
  }
  return new Uint8Array(img_buffer);
}

function convertToImage() {
  $("#loading").show();
  reset().then(() => {
    setTimeout(() => {
      left().then(
        (leftSide = raycastContainer.toDataURL("image/png")),
        canvasToImages.push(leftSide)
      );
    }, 100);
    setTimeout(() => {
      back().then(
        (backSide = raycastContainer.toDataURL("image/png")),
        canvasToImages.push(backSide)
      );
    }, 200);
    setTimeout(() => {
      right().then(
        (rightSide = raycastContainer.toDataURL("image/png")),
        canvasToImages.push(rightSide)
      );
    }, 300);
    setTimeout(() => {
      center().then(
        (centerSide = raycastContainer.toDataURL("image/png")),
        canvasToImages.push(centerSide)
      );
    }, 400);
    setTimeout(() => {
      center2();
      svgPrintable = canvas.toSVG();
      canvasToImages.push(svgPrintable);
      jpgLayoutThumbnail = canvas.toDataURL("image/png");
      canvasToImages.push(jpgLayoutThumbnail);
      for (let i = 0; i < logos.length; i++) {
        canvasToImages.push(logos[i]);
      }
    }, 500);
    setTimeout(() => {
      let tokens = localStorage.getItem("token");
      let qty = document.getElementById("qty").value;
      let m_data = "";
      let m_fileType = "";

      // console.log(canvasToImages);
      for (let i = 0; i < canvasToImages.length; i++) {
        if (i == 0) {
          m_data = canvasToImages[i];
        } else {
          m_data = m_data + "|" + canvasToImages[i];
        }

        let mimeType2 = canvasToImages[i].match(/[^:/]\w+(?=;|,)/)[0];
        if (mimeType2 != " none") {
          if (mimeType2 == "png") {
            if (m_fileType == "") {
              m_fileType = "png";
            } else {
              m_fileType = m_fileType + "|" + "png";
            }

            $.post(
              "upload.php",
              {
                fileType: "png",
                userName: tokens,
                m_qty: qty,
                m_i: i,
                img: canvasToImages[i],
              },
              function (data) {
                // console.log(data);
              }
            );
          } else {
            if (m_fileType == "") {
              m_fileType = "jpeg";
            } else {
              m_fileType = m_fileType + "|" + "jpeg";
            }

            $.post(
              "upload.php",
              {
                fileType: "jpeg",
                userName: tokens,
                m_i: i,
                img: canvasToImages[i],
              },
              function (data) {
                // console.log(data);
              }
            );
          }
        } else if (mimeType2 == " none") {
          if (m_fileType == "") {
            m_fileType = "svg";
          } else {
            m_fileType = m_fileType + "|" + "svg";
          }

          $("#imageContainer").append(canvasToImages[i]);
          var s = new XMLSerializer().serializeToString(
            $("#imageContainer").children()[0]
          );
          var encodedData = window.btoa(s);
          $.post(
            "upload.php",
            {
              fileType: "svg",
              userName: tokens,
              m_i: i,
              img: encodedData,
            },
            function (data) {
              // console.log(data);
            }
          );
        }
      }

      $.post(
        "send_api.php",
        {
          userName: tokens,
          xfileType: m_fileType,
          m_qty: qty,
          xm_data: m_data,
        },
        function (data) {
          window.location = "/cart";
          $("#loading").hide();
        }
      );
      canvasToImages = [];
    }, 700);
  });

  canvas.discardActiveObject().renderAll();
}

$('.collapse').on('show.bs.collapse', function (e) {
  var selectedCollape = $(e.target).attr('id')
  if(selectedCollape === 'collapseOne') {
    $('.steps div.step:nth-child(1)').addClass('active')
    $('.steps div.step:nth-child(2)').removeClass('active')
    $('.steps div.step:nth-child(3)').removeClass('active')
    $('.steps div.step:nth-child(4)').removeClass('active')
  }
  else if(selectedCollape === 'collapseTwo') {
    $('.steps div.step:nth-child(1)').removeClass('active')
    $('.steps div.step:nth-child(2)').addClass('active')
    $('.steps div.step:nth-child(3)').removeClass('active')
    $('.steps div.step:nth-child(4)').removeClass('active')
  }
  else if(selectedCollape === 'collapseThree') {
    $('.steps div.step:nth-child(1)').removeClass('active')
    $('.steps div.step:nth-child(2)').removeClass('active')
    $('.steps div.step:nth-child(3)').addClass('active')
    $('.steps div.step:nth-child(4)').removeClass('active')
  }
  else if(selectedCollape === 'collapseFour') {
    $('.steps div.step:nth-child(1)').removeClass('active')
    $('.steps div.step:nth-child(2)').removeClass('active')
    $('.steps div.step:nth-child(3)').removeClass('active')
    $('.steps div.step:nth-child(4)').addClass('active')
  }
});