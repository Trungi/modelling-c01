
// computes bezier curve
function bezier(t, p0, p1, p2, p3) {
    var bezier = Math.pow((1-t), 3)*p0 + 3*Math.pow((1-t), 2)*t*p1 + 3*(1-t)*Math.pow(t, 2)*p2 + Math.pow(t, 3)*p3;
    return bezier;
}