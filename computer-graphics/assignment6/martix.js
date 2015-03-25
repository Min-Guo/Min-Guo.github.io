var Matrix = function () {};
Matrix.prototype.scale = function (x, y) {
  var transformMatrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
  // for ( i = 0; i < 2; i ++) {
  //   transformMatrix[i][i] = x;
  // }
  transformMatrix[0][0] = x;
  transformMatrix[1][1] = y;
  return transformMatrix;
}

Matrix.prototype.identity = function (x) {
  var transformMatrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
  for ( i = 0; i < 4; i ++) {
    transformMatrix[i][i] = x;
  }
  return transformMatrix;
}


Matrix.prototype.perspective = function (x, z) {
  var transformMatrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
  for ( i = 0; i < 2; i ++) {
    transformMatrix[i][i] = x / z;
  }
  transformMatrix[2][2] = x / z ;
  return transformMatrix;
}

Matrix.prototype.translate = function (x) {
  var transformMatrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
  for ( i = 0; i < 2; i ++) {
    transformMatrix[i][i] = 1;
  }
  for ( i = 0; i < 3; i ++) {
    transformMatrix[i][3] = x;
  }

  return transformMatrix;
}

Matrix.prototype.rotateZ = function (x) {
  var transformMatrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
  for (i = 0; i <2; i ++){
    transformMatrix[i][i] = Math.cos(x * Math.PI / 180);
  }
  transformMatrix[0][1] = - Math.sin(x * Math.PI / 180);
  transformMatrix[1][0] = Math.sin(x * Math.PI / 180);

  return transformMatrix;
}

Matrix.prototype.rotateX = function (x) {
  var transformMatrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
  transformMatrix[0][0] = transformMatrix[3][3] = 1;
  transformMatrix[1][1] = transformMatrix[2][2] = Math.cos(x * Math.PI / 180);
  transformMatrix[1][2] = Math.sin(x * Math.PI / 180);
  transformMatrix[2][1] = - Math.sin(x * Math.PI / 180);

  return transformMatrix;
}

Matrix.prototype.rotateY = function (x) {
  var transformMatrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
  transformMatrix[0][0] = transformMatrix[2][2] = Math.cos(x * Math.PI / 180);
  transformMatrix[0][2] = Math.sin(x * Math.PI / 180);
  transformMatrix[2][0] = - Math.sin(x * Math.PI / 180);

  return transformMatrix;
}

Matrix.prototype.translateZ = function (x) {
  var transformMatrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    transformMatrix[2][3] = x;
  return transformMatrix;
}

Matrix.prototype.matrixMultiply = function (matrix1, matrix2) {
  var matrix = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 1]];
  for (var i = 0; i < 4; i ++) {
    for (var j = 0; j < 4; j ++) {
      for (var k = 0; k < 4; k++) {
        matrix[i][j] = matrix[i][j] + matrix1[i][k] * matrix2[k][j];
      }
    }
  }
  return matrix;
}

function  generatePoint (matrix, originPoint)  {
  var Point = [0, 0, 0, 1];
  for (var i = 0; i < 4; i ++) {
    for (var j = 0; j < 4; j ++){
          Point[i] = Point[i] + matrix[i][j] * originPoint[j];
      }
  }
  return Point;
}
