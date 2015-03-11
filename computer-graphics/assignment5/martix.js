

function scaleMatrix(x, y, w) {
  var transformMatrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
  for ( i = 0; i < 2; i ++) {
    transformMatrix[i][i] = x;
  }
  return transformMatrix;
}

function identityMatrix(x) {
  var transformMatrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
  for ( i = 0; i < 4; i ++) {
    transformMatrix[i][i] = x;
  }

  return transformMatrix;
}

function translateMatrix(x) {
  var transformMatrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
  for ( i = 0; i < 2; i ++) {
    transformMatrix[i][i] = 1;
  }
  for ( i = 0; i < 3; i ++) {
    transformMatrix[i][3] = x;
  }

  return transformMatrix;
}

function rotateMatrix(x) {
  var transformMatrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
  for (i = 0; i <2; i ++){
    transformMatrix[i][i] = Math.cos(x * Math.PI / 180);
  }
  transformMatrix[0][1] = - Math.sin(x * Math.PI / 180);
  transformMatrix[1][0] = Math.sin(x * Math.PI / 180);

  return transformMatrix;
}

function  generatePoint (matrix, originPoint)  {
  var Point = [0, 0, 0, 1];
  for (i = 0; i < 4; i ++) {
    for (j = 0; j < 4; j ++){
          Point[i] = Point[i] + matrix[i][j] * originPoint[j];
      }
  }
  return Point;
}
