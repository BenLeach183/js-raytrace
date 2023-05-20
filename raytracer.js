//  HOW TO USE
//  The website renders the default scene when you load it.
//  
//   - Adding Models
//  The project contains a folder with some example .obj files, these are named with
//  the approximate time they take to render with nothing else on the screen and with 
//  their default position and scale.
//  You can add the files by dragging them into the upload area, or by clicking "Choose File".
//  By default an object is added into the scene, this can be removed or edited.
//  You can add objects into the scene by clicking "➕" in the object dropdown.
//
//   - Object Dropdown
//  You can open the "➤ Sphere" dropdown to access all the spheres in the scene,
//  as more 3d models are added more object dropdowns will appear, if more are added
//  then can fit in the box you can scroll.
//
//   - Editing Objects
//  When you open the dropdown a table appears showing the values for each of that object,
//  you can edit the values for position, scale and colour.
//  You can also remove objects.
//
//   - Generate
//  The generate button will render the scene again.
//  Before the anti-aliasing, it will estimate how long the anti-aliasing might take,
//  when the render is finished it will tell you the total time since clicking the button.
//  
// --------------------------------------------------------------------------------------------
//  THE CODE
//  The code is separated into 8 sections.
//
//  1] VECTOR CLASS         Ln. 81
//  2] OBJECT CLASSES       Ln. 163
//  3] RAYS                 Ln. 393
//  4] CALCULATE COLOUR     Ln. 503
//  5] OBJ TO SCENE         Ln. 578
//  6] GUI                  Ln. 662
//  7] UPLOADING OBJ FILE   Ln. 876
//  8] MAIN                 Ln. 928
//
//  VECTOR CLASS
//  This stores the x, y, z values of a 3d vector, and contains methods for manipulating and creating new vectors.
//
//  OBJECT CLASSES
//  These store the information for the objects in the scene.
//  They contain functions to check for ray intersections with themselves.
//  It contains a sphere class, and an object class.
//  The object class is made from triangle classes, and also an AABB class which helps with optimizations
//  by checking if a ray intersects the bounding box of the 3d object.
//
//  RAYS
//  Performs ray intersection checks on all objects in the scene.
//  Also performs checks to see if a hit point is in shade.
//  Will return a hit or miss with information about the point including the normals and inShade.
//
//  CALCULATE COLOUR
//  This is responsible for calculating the colour of a pixel (or fraction of a pixel) and setting it.
//  Uses Phong shading, ambience, diffuse, specular highlights.
//  Also applies shadows and colour correction.
//
//  OBJ TO SCENE
//  Will take an obj file, and will parse it to find the vertices, faces and normals of a 3d object.
//  It will create a new object type and fill it with an array of triangles.
//
//  GUI
//  Handles the interface, will keep track of the objects data that's been input.
//  
//  UPLOADING OBJ FILE
//  This will listen for object drop event on the drop zone, and also check if a file is uploaded using the button.
//  It will extract the file information and add it to an uploadedModels array.
//  It will also extract the file name and use it to create a new object dropdown.
//
//  MAIN
//  Where the rendering happens.
//  The render is split into chunks so you can see the progress of it, it will loop over each chunk
//  and set the colour of each pixel.
//
//  It will then run an edge detection algorithm in order to only anti-alias areas that need it.
//  After the edge-detection it will create an estimated time for how long the anti-aliasing should take.
//  After the anti-aliasing is finished the render is done and it will show the total time taken from the start.

// ---------------------------------------------VECTOR CLASS--------------------------------------------// VECTOR CLASS
                                                                                                        //
// Simple vector in 3D with numbers for x, y and z                                                      //
class Vec3 {                                                                                            //
    constructor(x, y, z) {                                                                              //
        this.x = x                                                                                      //
        this.y = y                                                                                      //
        this.z = z                                                                                      //
    }                                                                                                   //
                                                                                                        //
    // Add other vector to this one and return the result                                               //
    add(other) {                                                                                        //
        return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);                          //
    }                                                                                                   //
                                                                                                        //
    // Subtract other vector from this one and return the result                                        //
    minus(other) {                                                                                      //
        return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);                          //
    }                                                                                                   //
                                                                                                        //
    // Multiply other vector by this one and return the result                                          // VECTOR CLASS
    multiply(other) {                                                                                   //
        return new Vec3(this.x * other.x, this.y * other.y, this.z * other.z);                          //
    }                                                                                                   //
                                                                                                        //
    // Divide other vector by this one and return the result                                            //
    divide(other) {                                                                                     //
        if (other.x == 0 || other.y == 0 || other.z == 0) {                                             //
            return new Vec3(-1, -1, -1);                                                                //
        }                                                                                               //
                                                                                                        //
        return new Vec3(this.x / other.x, this.y / other.y, this.z / other.z);                          //
    }                                                                                                   //
                                                                                                        //
    // Scale this vector by the number scalar and return the result                                     //
    scale(scalar) {                                                                                     //
        return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);                             //
    }                                                                                                   //
                                                                                                        //
    // Calculate the dot product of this vector with the other and return the result                    //
    dot(other) {                                                                                        // VECTOR CLASS
        return (this.x * other.x) + (this.y * other.y) + (this.z * other.z);                            //
    }                                                                                                   //
                                                                                                        //
    // Calculate and return the magnitude of this vector                                                //
    magnitude() {                                                                                       //
        return this.magnitudeSquared() ** 0.5;                                                          //
    }                                                                                                   //
                                                                                                        //
    // Calculate and return the magnitude of this vector without the square root                        //
    magnitudeSquared() {                                                                                //
        return this.x ** 2 + this.y ** 2 + this.z ** 2;                                                 //
    }                                                                                                   //
                                                                                                        //
    // Return a normalised version of this vector                                                       //
    normalised() {                                                                                      //
        const magnitude = this.magnitude();                                                             //
        return new Vec3(this.x / magnitude, this.y / magnitude, this.z / magnitude);                    //
    }                                                                                                   //
                                                                                                        //
    // Return the sum of all values in vector                                                           // VECTOR CLASS
    sum() {                                                                                             //
        return this.x + this.y + this.z;                                                                //
    }                                                                                                   //
                                                                                                        //
    // Return the reflected vector across a normalised normal                                           //
    reflect(normal) {                                                                                   //
        // R = 2<N.D>N - D                                                                              //
        return normal.scale(2 * this.dot(normal)).minus(this);                                          //
    }                                                                                                   //
                                                                                                        //
    // Add a scalar to all components                                                                   //
    addScalar(number) {                                                                                 //
        return new Vec3(this.x + number, this.y + number, this.z + number);                             //
    }                                                                                                   //
                                                                                                        //
    crossProduct(other) {
        return new Vec3(this.y * other.z - this.z * other.y, this.z * other.x - this.x * other.z, this.x * other.y - this.y * other.x);
    }                                                                                                   //
}                                                                                                       //
// -----------------------------------------------------------------------------------------------------// VECTOR CLASS

// --------------------------------------------OBJECT CLASSES-------------------------------------------// OBJECT CLASSES
                                                                                                        //
// A sphere in 3D space. Has centre, radius and colour all of which are Vec3s.                          //
class Sphere {                                                                                          //
    constructor(centre, radius, colour) {                                                               //
        this.centre = centre                                                                            //
        this.radius = radius                                                                            //
        this.colour = colour                                                                            //
    }                                                                                                   //
                                                                                                        //
    // Calculate the point on the sphere  where the ray intersects using                                //
    // a quadratic equation and return the t value of the ray for that point.                           //
    // If two solutions exist return the minus solution.                                                //
    // If no solutions exist return -1.                                                                 //
    rayIntersects(ray) {                                                                                //
        // a = d.d                                                                                      //
        let a = ray.direction.dot(ray.direction);                                                       //
                                                                                                        //
        let originMinusCentre = ray.origin.minus(this.centre);                                          //
                                                                                                        //
        // b = 2d . (o-c)                                                                               // OBJECT CLASSES
        let b = ray.direction.scale(2).dot(originMinusCentre);                                          //
                                                                                                        //
        // c = (o-c).(o-c)-r^2                                                                          //
        let c = originMinusCentre.dot(originMinusCentre) - (this.radius * this.radius);                 //
                                                                                                        //
        // Return the t value                                                                           //
        let discriminant = b ** 2 - (4 * a * c);                                                        //
        if (discriminant < 0) return -1;                                                                //
        return (-b - discriminant ** 0.5) / (2 * a);                                                    //
    }                                                                                                   //
}                                                                                                       //
                                                                                                        //
// Represents a triangle within an object, has 3 vertices and a normal for shading.                     //
class Triangle {                                                                                        //
    constructor(vertices, shadingNormal) {                                                              //
        this.vertices = vertices;                                                                       //
        this.normal = this.calcNormal();                                                                //
                                                                                                        //
        // If shading normal isn't passed use the face normal.                                          //
        if (shadingNormal == null) {                                                                    // OBJECT CLASSES
            this.shadingNormal = this.normal;                                                           //
        } else {                                                                                        //
            this.shadingNormal = shadingNormal.normalised();                                            //
        }                                                                                               //
                                                                                                        //
        this.flipped = false;                                                                           //
    }                                                                                                   //
                                                                                                        //
    // Calculate the point on the triangle that a ray intersects.                                       //
    // If no solution exists return -1.                                                                 //
    rayIntersects(ray, doubleSided) {                                                                   //
        // Inverse the direction of the normal if the triangle is flipped.                              //
        if (ray.direction.dot(this.normal) < 0 && doubleSided && !this.flipped) {                       //
            this.flipped = true;                                                                        //
            this.normal = this.normal.scale(-1);                                                        //
        }                                                                                               //
                                                                                                        //
        if (this.flipped && !(ray.direction.dot(this.normal) < 0 && doubleSided)) {                     //
            this.flipped = false;                                                                       //
            this.normal = this.normal.scale(-1);                                                        // OBJECT CLASSES
        }                                                                                               //
                                                                                                        //
        // Calculate point ray intersects plane that the triangle sits on.                              //
        let t = this.intersectPlane(ray);                                                               //
                                                                                                        //
        // If ray doesn't intersect (parallel) or plane is behind camera return -1.                     //
        if (t < 0) {                                                                                    //
            return t;                                                                                   //
        }                                                                                               //
                                                                                                        //
        let point = ray.pointAt(t);                                                                     //
                                                                                                        //
        // Check if point is within triangle bounding box, for optimization.
        if (point.x + 0.00001 < Math.min(Math.min(this.vertices[0].x, this.vertices[1].x), this.vertices[2].x) ||
            point.x - 0.00001 > Math.max(Math.max(this.vertices[0].x, this.vertices[1].x), this.vertices[2].x) ||
            point.y + 0.00001 < Math.min(Math.min(this.vertices[0].y, this.vertices[1].y), this.vertices[2].y) ||
            point.y - 0.00001 > Math.max(Math.max(this.vertices[0].y, this.vertices[1].y), this.vertices[2].y) ||
            point.z + 0.00001 < Math.min(Math.min(this.vertices[0].z, this.vertices[1].z), this.vertices[2].z) ||
            point.z - 0.00001 > Math.max(Math.max(this.vertices[0].z, this.vertices[1].z), this.vertices[2].z)
        ) {
            return -1;                                                                                  //
        }                                                                                               //
                                                                                                        //
        // Check if point is inside triangle using inside-outside                                       //
        let edgeVectors = [                                                                             //
            this.vertices[2].minus(this.vertices[0]),                                                   //
            this.vertices[1].minus(this.vertices[2]),                                                   //
            this.vertices[0].minus(this.vertices[1])                                                    //
        ];                                                                                              //
                                                                                                        //
        let pointVectors = [                                                                            // OBJECT CLASSES
            point.minus(this.vertices[0]),                                                              //
            point.minus(this.vertices[2]),                                                              //
            point.minus(this.vertices[1])                                                               //
        ];                                                                                              //
                                                                                                        //
        if (this.normal.dot(edgeVectors[0].crossProduct(pointVectors[0])) < 0.0000001 &&                //
            this.normal.dot(edgeVectors[1].crossProduct(pointVectors[1])) < 0.0000001 &&                //
            this.normal.dot(edgeVectors[2].crossProduct(pointVectors[2])) < 0.0000001) {                //
            return t;                                                                                   //
        }                                                                                               //
                                                                                                        //
        return -1;                                                                                      //
    }                                                                                                   //
                                                                                                        //
    intersectPlane(ray) {                                                                               //
        // Check if ray and plane are parallel.                                                         //
        let normalDotDir = this.normal.dot(ray.direction);                                              //
        if (normalDotDir < 0.000001) return -1;                                                         //
                                                                                                        //
        // Find the plane offset.                                                                       // OBJECT CLASSES
        let d = -(this.normal.dot(this.vertices[1]));                                                   //
                                                                                                        //
        // Find the distance to point on plane.                                                         //
        let t = -(this.normal.dot(ray.origin) + d) / normalDotDir;                                      //
        return t;                                                                                       //
    }                                                                                                   //
                                                                                                        //
    // Calculate normal of plane.                                                                       //
    calcNormal() {                                                                                      //
        let ab = this.vertices[1].minus(this.vertices[0]);                                              //
        let ac = this.vertices[2].minus(this.vertices[0]);                                              //
                                                                                                        //
        return ab.crossProduct(ac).normalised();                                                        //
    }                                                                                                   //
}                                                                                                       //
                                                                                                        //
// Represents a 3d object in the scene, made up of triangles, bounding box and a colour.                //
class Object {                                                                                          //
    constructor(triangles, boundingBox, colour) {                                                       //
        this.triangles = triangles;                                                                     //
        this.boundingBox = boundingBox;                                                                 //
        this.colour = colour;                                                                           //
        this.currentTriangleIndex = -1;                                                                 //
    }                                                                                                   //
                                                                                                        //
    // Calculate the point on the object a ray intersects.                                              //
    // If the ray doesn't intersect return -1.                                                          //
    rayIntersects(ray, doubleSided) {                                                                   //
        let t = -1;                                                                                     //
                                                                                                        // OBJECT CLASSES
        // Check if ray intersects the bounding box of the object first as an optimization.             //
        if (!this.boundingBox.rayIntersects(ray)) {                                                     //
            return t;                                                                                   //
        }                                                                                               //
                                                                                                        //
        // Loop over each triangle in the object and check for intersection.                            //
        for (let i = 0; i < this.triangles.length; i++) {                                               //
            let current_t = this.triangles[i].rayIntersects(ray, doubleSided);                          //
            if (current_t > -0.000000001 && (current_t < t || t == -1)) {                               //
                t = current_t;                                                                          //
                this.currentTriangleIndex = i;                                                          //
            }                                                                                           //
        }                                                                                               //
                                                                                                        //
        return t;                                                                                       //
    }                                                                                                   //
                                                                                                        //
}                                                                                                       //
                                                                                                        //
// Represents a bounding box used to approximate an object to check if ray intersects                   // OBJECT CLASSES
// the area an object occupies, reduces the amount of checks needed on individual triangles.            //
class AABB {                                                                                            //
    constructor(minimumCorner, maximumCorner) {                                                         //
        this.minimumCorner = minimumCorner;                                                             //
        this.maximumCorner = maximumCorner;                                                             //
    }                                                                                                   //
                                                                                                        //
    rayIntersects(ray) {                                                                                //
        // Uses AABB ray box intersection algorithm.                                                    //
        // Keeps track of minimum and maximum axis intersection.                                        //
        // If ray intersects minimum and maximum points of box in one axis                              //
        // before intersecting the minimum of another axis the ray misses.                              //
        let tmin;                                                                                       //
        let tmax;                                                                                       //
        let tymin;                                                                                      //
        let tymax;                                                                                      //
        let tzmin;                                                                                      //
        let tzmax;                                                                                      //
                                                                                                        //
        if (ray.direction.x >= 0) {                                                                     // OBJECT CLASSES
            tmin = (this.minimumCorner.x - ray.origin.x) / ray.direction.x;                             //
            tmax = (this.maximumCorner.x - ray.origin.x) / ray.direction.x;                             //
        } else {                                                                                        //
            tmin = (this.maximumCorner.x - ray.origin.x) / ray.direction.x;                             //
            tmax = (this.minimumCorner.x - ray.origin.x) / ray.direction.x;                             //
        }                                                                                               //
                                                                                                        //
        if (ray.direction.y >= 0) {                                                                     //
            tymin = (this.minimumCorner.y - ray.origin.y) / ray.direction.y;                            //
            tymax = (this.maximumCorner.y - ray.origin.y) / ray.direction.y;                            //
        } else {                                                                                        //
            tymin = (this.maximumCorner.y - ray.origin.y) / ray.direction.y;                            //
            tymax = (this.minimumCorner.y - ray.origin.y) / ray.direction.y;                            //
        }                                                                                               //
                                                                                                        //
        if ((tmin > tymax) || (tymin > tmax)) {                                                         //
            return false;                                                                               //
        }                                                                                               //
                                                                                                        //
        if (tymin > tmin) {                                                                             // OBJECT CLASSES
            tmin = tymin;                                                                               //
        }                                                                                               //
                                                                                                        //
        if (tymax < tmax) {                                                                             //
            tmax = tymax;                                                                               //
        }                                                                                               //
                                                                                                        //
        if (ray.direction.z > 0) {                                                                      //
            tzmin = (this.minimumCorner.z - ray.origin.z) / ray.direction.z;                            //
            tzmax = (this.maximumCorner.z - ray.origin.z) / ray.direction.z;                            //
        } else {                                                                                        //
            tzmin = (this.maximumCorner.z - ray.origin.z) / ray.direction.z;                            //
            tzmax = (this.minimumCorner.z - ray.origin.z) / ray.direction.z;                            //
        }                                                                                               //
                                                                                                        //
        if ((tmin > tzmax) || (tzmin > tmax)) {                                                         //
            return false;                                                                               //
        }                                                                                               //
                                                                                                        //
        if (tzmin > tmin) {                                                                             //
            tmin = tzmin;                                                                               //
        }                                                                                               //
                                                                                                        //
        return true;                                                                                    //
    }                                                                                                   //
}                                                                                                       //
// -----------------------------------------------------------------------------------------------------// OBJECT CLASSES

// -------------------------------------------------RAYS------------------------------------------------// RAYS
                                                                                                        //
// Ray which has an origin and direction, both are Vec3's.                                              //
class Ray {                                                                                             //
    constructor(origin, direction) {                                                                    //
        this.origin = origin                                                                            //
        this.direction = direction                                                                      //
    }                                                                                                   //
                                                                                                        //
    // Calculate and return the point in space (a Vec3) for this ray for the given value of t.          //
    pointAt(t) {                                                                                        //
        return this.origin.add(this.direction.scale(t));                                                //
    }                                                                                                   //
}                                                                                                       //
                                                                                                        //
// The result of casting a ray into our scene                                                           //
// Position is the point where the ray intersects a sphere/object in the scene.                         //
// Normal is the normal unit vector of the sphere/object at the intersection point.                     
// t is the t value along the ray where the intersection point is.  This value should, be -1 when the ray hits nothing.
// ObjectIndex is the array index of the sphere/object hit by the ray.                                  
// inShade is a boolean representing if a hit is in shade.                                              // 
class RayCastResult {                                                                                   // RAYS
    constructor(position, normal, t, objectIndex, inShade) {                                            //
        this.position = position                                                                        //
        this.normal = normal                                                                            //
        this.t = t                                                                                      //
        this.objectIndex = objectIndex                                                                  //
        this.inShade = inShade                                                                          //
    }                                                                                                   //
}                                                                                                       //
                                                                                                        //
// Calculate the intersection point and normal when a ray hits a sphere/object. Returns a RayCastResult.//
function hit(ray, t, objectIndex, inShade) {                                                            //
    let intersectionPoint = ray.pointAt(t);                                                             //
    let intersectionNormal;                                                                             //
                                                                                                        //
    if (objectIndex < spheres.length) {                                                                 //
        intersectionNormal = intersectionPoint.minus(spheres[objectIndex].centre).normalised();         //
    } else {                                                                                            //
        const object = objects[objectIndex - spheres.length];                                           //
        intersectionNormal = object.triangles[object.currentTriangleIndex].shadingNormal.scale(-1);     //
    }                                                                                                   // RAYS
                                                                                                        //
    return new RayCastResult(intersectionPoint, intersectionNormal, t, objectIndex, inShade);           //
}                                                                                                       //
                                                                                                        //
// Return a RayCastResult when a ray misses everything in the scene.                                    //
function miss() {                                                                                       //
    return new RayCastResult(new Vec3(0, 0, 0), new Vec3(0, 0, 0), -1, -1, false)                       //
}                                                                                                       //
                                                                                                        //
// Check whether a ray hits anything in the scene and return a RayCast Result.                          //
function traceRay(ray) {                                                                                //
    let t = 1000000                                                                                     //
    let objectIndex = -1;                                                                               //
    let inShade = false;                                                                                //
                                                                                                        //
    // Loop over each sphere, check if ray hits and keep track of closest hit.                          //
    for (let i = 0; i < spheres.length; i++) {                                                          //
        let current_t = spheres[i].rayIntersects(ray);                                                  //
        if (current_t > 0 && current_t < t) {                                                           //
            t = current_t;                                                                              // RAYS
            objectIndex = i;                                                                            //
        }                                                                                               //
    }                                                                                                   //
                                                                                                        //
    // Loop over each object, check if ray hits and keep track of closest hit.                          //
    for (let i = 0; i < objects.length; i++) {                                                          //
        let current_t = objects[i].rayIntersects(ray, false);                                           //
        if (current_t > 0 && current_t < t) {                                                           //
            t = current_t;                                                                              //
            objectIndex = spheres.length + i;                                                           //
        }                                                                                               //
    }                                                                                                   //
                                                                                                        //
    // If the index of the hit object is -1 return a miss.                                              //
    if (objectIndex < 0) return miss();                                                                 //
                                                                                                        //
    // Test if the point is in shade, adn then return a hit.                                            //
    inShade = calculateShadows(ray.pointAt(t), objectIndex);                                            //
    return hit(ray, t, objectIndex, inShade);                                                           //
}                                                                                                       // RAYS
                                                                                                        //
// Calculate whether a point is in shade.                                                               //
function calculateShadows(position, objectIndex) {                                                      //
    // Create a new ray from the hit point to the light source.                                         //
    let ray = new Ray(position, negLightDirection);                                                     //
                                                                                                        //
    // Check if the ray intersects any other object, if it intersects it's own object                   //
    // I skip over it for now, this is because of the diffuse lighting, commenting out                  //
    // if(i == objectIndex) continue;                                                                   //
    // and                                                                                              //
    // if(i == objectIndex-spheres.length) continue;                                                    //
    // will mean objects cast shadows on themselves again.                                              //
    for (let i = 0; i < spheres.length; i++) {                                                          //
        if(i == objectIndex) continue;                                                                  //
                                                                                                        //
        let t = spheres[i].rayIntersects(ray);                                                          //
        if (t > -0.0000000001) return true;                                                             //
    }                                                                                                   //
                                                                                                        //
    for (let i = 0; i < objects.length; i++) {                                                          //
        if(i == objectIndex-spheres.length) continue;                                                   //
                                                                                                        //
        let t = objects[i].rayIntersects(ray, false);                                                   //
        if (t > -0.0000000001) return true;                                                             //
    }                                                                                                   //
}                                                                                                       //
// -----------------------------------------------------------------------------------------------------// RAYS

// -------------------------------------------CALCULATE COLOUR------------------------------------------// CALCULATE COLOUR
                                                                                                        //
// Calculate and return the background colour based on the ray.                                         // 
function backgroundColour(ray) {                                                                        //
    // Calculate the ray position on background in range 0-1.                                           //
    let t = 0.5 * (ray.direction.y + 1);                                                                //
                                                                                                        //
    const topColour = new Vec3(0.3, 0.5, 0.9); // Blue                                                  //
    const bottomColour = new Vec3(1, 1, 1); // White                                                    //
                                                                                                        //
    // Linear interpolate between two colours using t.                                                  //
    let background = bottomColour.scale(1 - t).add(topColour.scale(t));                                 //
                                                                                                        //
    // Colour correction                                                                                //
    background.x = Math.sqrt(background.x);                                                             //
    background.y = Math.sqrt(background.y);                                                             //
    background.z = Math.sqrt(background.z);                                                             //
                                                                                                        //
    return background;                                                                                  //
}                                                                                                       //
                                                                                                        // CALCULATE COLOUR
// Returns the colour the ray should have as a Vec3 with RGB values in [0,1].                           //
function rayColour(ray) {                                                                               //
    let castResult = traceRay(ray);                                                                     //
                                                                                                        //
    // If ray doesn't hit object, or object is behind camera, return background colour.                 //
    if (castResult.t < 0) return backgroundColour(ray);                                                 //
                                                                                                        //
    let albedo;                                                                                         //
                                                                                                        //
    if (castResult.objectIndex < spheres.length) {                                                      //
        albedo = spheres[castResult.objectIndex].colour;                                                //
    } else {                                                                                            //
        albedo = objects[castResult.objectIndex - spheres.length].colour;                               //
    }                                                                                                   //
                                                                                                        //
    // Shadows                                                                                          //
    let shadow = 1;                                                                                     //
    if (castResult.inShade) {                                                                           //
        shadow = 0.4;                                                                                   //
    }                                                                                                   // CALCULATE COLOUR
                                                                                                        //
    // Diffuse                                                                                          //
    let diffuseStrength = 1.0;                                                                          //
    let diffuse = Math.max(castResult.normal.dot(negLightDirection), 0);                                //
                                                                                                        //
    // Ambient Lighting                                                                                 //
    let ambientLighting = 0.05;                                                                         //
                                                                                                        //
    // Specular reflection                                                                              //
    let specularStrength = 0.8;                                                                         //
    if (castResult.inShade) specularStrength = 0.0;                                                     //
    let specularPower = 25;                                                                             //
    let reflectedLight = lightDirection.reflect(castResult.normal);                                     //
    let specular = Math.max(reflectedLight.dot(ray.direction.normalised()), 0) ** specularPower;        //
                                                                                                        //
    // Apply shading.                                                                                   //
    let phongShading = (ambientLighting + (diffuseStrength * diffuse) + (specularStrength * specular)) * shadow;
    colour = albedo.scale(phongShading);                                                                //
                                                                                                        //
    // Colour correction                                                                                // CALCULATE COLOUR
    colour.x = Math.sqrt(colour.x);                                                                     //
    colour.y = Math.sqrt(colour.y);                                                                     //
    colour.z = Math.sqrt(colour.z);                                                                     //
                                                                                                        //
    return colour;                                                                                      //
}                                                                                                       //
                                                                                                        //
// Sets a pixel at (x, y) in the canvas with an RGB Vec3                                                //
function setPixel(x, y, colour) {                                                                       //
    ctx.fillStyle = "rgba(" + colour.x + "," + colour.y + "," + colour.z + "," + 1 + ")"                //
    ctx.fillRect(x, c.height - y, 1, 1)                                                                 //
}                                                                                                       //
// -----------------------------------------------------------------------------------------------------// CALCULATE COLOUR

// ---------------------------------------------OBJ TO SCENE--------------------------------------------// OBJ TO SCENE
                                                                                                        //
// Load OBJ file into scene                                                                             //
function openModel(fileText, scale, offset, colour) {                                                   //
    const lines = fileText.split('\n');                                                                 //
    const vertices = [];                                                                                //
    const normals = [];                                                                                 //
    let facePoints = [];                                                                                //
    let faceNormals = [];                                                                               //
    let tris = [];                                                                                      //
                                                                                                        //
    // Extract vertices.                                                                                //
    for (const line of lines) {                                                                         //
        if (line.startsWith('v ')) {                                                                    //
            const [, vx, vy, vz] = line.split(' ');                                                     //
            vertices.push(new Vec3(parseFloat(vx), parseFloat(vy), parseFloat(vz)));                    //
        }                                                                                               //
                                                                                                        //
        // Extract the normal of each vertex.                                                           //
        if (line.startsWith('vn ')) {                                                                   //
            const [, vnx, vny, vnz] = line.split(' ');                                                  // OBJ TO SCENE
            normals.push(new Vec3(parseFloat(vnx), parseFloat(vny), parseFloat(vnz)));                  //
        }                                                                                               //
                                                                                                        //
        // List the vertices and normals for each face.                                                 //
        if (line.startsWith('f ')) {                                                                    //
            // Separate the faces                                                                       //
            const faces = line.split(' ');                                                              //
            facePoints = [];                                                                            //
            faceNormals = [];                                                                           //
                                                                                                        //
            // Store the vertices and normals for each face.                                            //
            for (let i = 1; i < faces.length; i++) {                                                    //
                facePoints[i - 1] = parseInt(faces[i].split("/")[0]) - 1;                               //
                faceNormals[i - 1] = parseInt(faces[i].split("/")[2]) - 1;                              //
            }                                                                                           //
                                                                                                        //
            // Average the vertex normals to get face normal, for flat shading.                         //
            let normal = new Vec3(0, 0, 0);;                                                            //
            for (let i = 0; i < faceNormals.length; i++) {                                              //
                normal = normal.add(normals[faceNormals[i]]);                                           // OBJ TO SCENE
            }                                                                                           //
                                                                                                        //
            normal = normal.scale(-1 / faceNormals.length);                                             //
            tris = tris.concat(facesToTris(facePoints, vertices, normal, scale, offset, colour));       //
        }                                                                                               //
    }                                                                                                   //
                                                                                                        //
    // Find the minimum and maximum for bounding box.                                                   //
    let minimum = new Vec3(vertices[0].x, vertices[0].y, vertices[0].z);                                //
    let maximum = new Vec3(vertices[0].x, vertices[0].y, vertices[0].z);                                //
                                                                                                        //
    for (const v of vertices) {                                                                         //
        if (v.x < minimum.x) { minimum.x = v.x; }                                                       //
        if (v.y < minimum.y) { minimum.y = v.y; }                                                       //
        if (v.z < minimum.z) { minimum.z = v.z; }                                                       //
                                                                                                        //
        if (v.x > maximum.x) { maximum.x = v.x; }                                                       //
        if (v.y > maximum.y) { maximum.y = v.y; }                                                       //
        if (v.z > maximum.z) { maximum.z = v.z; }                                                       //
    }                                                                                                   // OBJ TO SCENE
                                                                                                        //
    // Scale bounding box based on object scale.                                                        //
    minimum = minimum.scale(scale).add(offset);                                                         //
    maximum = maximum.scale(scale).add(offset);                                                         //
    // Create bounding box.                                                                             //
    const box = new AABB(minimum, maximum);                                                             //
                                                                                                        //
    // Create a new object with the triangles, bounding box and colour.                                 //
    objects.push(new Object(tris, box, colour));                                                        //
}                                                                                                       //
                                                                                                        //
// Convert the face with n points to triangles.                                                         //
function facesToTris(facePoints, vertices, normal, scale, offset) {                                     //
    let tris = [];                                                                                      //
                                                                                                        //
    for (let i = 1; i <= facePoints.length - 2; i++) {                                                  //
        // Add new triangle to array with scale, offset and normal.                                     //
        tris.push(new Triangle([vertices[facePoints[i]].scale(scale).add(offset), vertices[facePoints[0]].scale(scale).add(offset), vertices[facePoints[i + 1]].scale(scale).add(offset)], normal));
    }                                                                                                   //
    return tris;                                                                                        //
}                                                                                                       //
// -----------------------------------------------------------------------------------------------------// OBJ TO SCENE               

// --------------------------------------------------GUI------------------------------------------------// GUI
                                                                                                        //
// List of objects from gui                                                                             //
let models = [                                                                                          //
    [                                                                                                   //
        [new Vec3(0, 0, -1), 0.3, new Vec3(255, 0, 0)],                                                 //
        [new Vec3(0, 0.2, -0.8), 0.15, new Vec3(0, 0, 255)],                                            //
        [new Vec3(0, -100.5, -1), 100, new Vec3(0, 255, 0)]                                             //
    ]                                                                                                   //
];                                                                                                      //
                                                                                                        //
let selectedDropdownID = -1;                                                                            //
let selectedDropdown = null;                                                                            //
let addButton;                                                                                          //
let table;                                                                                              //
                                                                                                        //
// Called when a model dropdown button is clicked                                                       //
function objectDropdown(button) {                                                                       //
    const id = parseInt(button.id);                                                                     //
                                                                                                        //
    // If deselecting a currently selected item                                                         //
    if (selectedDropdownID == id) {                                                                     // GUI
        closeDropdown(button);                                                                          //
        selectedDropdownID = -1;                                                                        //
        return;                                                                                         //
    }                                                                                                   //
                                                                                                        //
    // If selecting an item when no item is currently selected                                          //
    if (selectedDropdownID == -1) {                                                                     //
        selectDropdown(button);                                                                         //
        return;                                                                                         //
    }                                                                                                   //
                                                                                                        //
    // If selecting an item when another one is selected.                                               //
    closeDropdown(selectedDropdown);                                                                    //
    selectDropdown(button);                                                                             //
}                                                                                                       //
                                                                                                        //
function closeDropdown(button) {                                                                        //
    button.style.backgroundColor = "rgb(29, 168, 48)";                                                  //
    const tempText = selectedDropdown.innerHTML;                                                        //
    button.innerHTML = "➤" + tempText.substr(1);                                                       // GUI
    addButton.remove();                                                                                 //
    table.remove();                                                                                     //
}                                                                                                       //
                                                                                                        //
// Called when a dropdown is being opened.                                                              //
function selectDropdown(button) {                                                                       //
    const id = parseInt(button.id);                                                                     //
                                                                                                        //
    button.style.backgroundColor = "rgb(180, 205, 180)";                                                //
    const buttonTempText = button.innerHTML;                                                            //
    button.innerHTML = "▼" + buttonTempText.substr(1);                                                  //
    const objectItem = document.getElementById("object-item-" + id);                                    //
                                                                                                        //
    // Create a add button to add more objects.                                                         //
    addButton = createAddButton(id);                                                                    //
    objectItem.appendChild(addButton);                                                                  //
                                                                                                        //
    // Create the table to display object data.                                                         //
    table = createObjectTable(id);                                                                      //
    objectItem.appendChild(table);                                                                      //
                                                                                                        //
    selectedDropdown = button;                                                                          //
    selectedDropdownID = id;                                                                            //
}                                                                                                       // GUI
                                                                                                        //
// Returns a table html element filled with the object data.                                            //
function createObjectTable(id) {                                                                        //
    const table = document.createElement("table");                                                      //
                                                                                                        //
    // Create headings                                                                                  //
    const headingRow = document.createElement("tr");                                                    //
    const tableHeadings = [];                                                                           //
    tableHeadings[0] = document.createElement("th");                                                    //
    tableHeadings[1] = document.createElement("th");                                                    //
    tableHeadings[2] = document.createElement("th");                                                    //
    tableHeadings[3] = document.createElement("th");                                                    //
    tableHeadings[0].appendChild(document.createTextNode("Position"));                                  //
    tableHeadings[1].appendChild(document.createTextNode("Scale"));                                     //
    tableHeadings[2].appendChild(document.createTextNode("Colour"));                                    //
    tableHeadings[3].appendChild(document.createTextNode("Remove"));                                    //
                                                                                                        //
    for (let i = 0; i < tableHeadings.length; i++) {                                                    //
        headingRow.appendChild(tableHeadings[i]).setAttribute("class", "input-text");                   //
    }                                                                                                   //
                                                                                                        // GUI
    table.appendChild(headingRow);                                                                      //
                                                                                                        //
    // Add Data from the models array                                                                   //
    for (let i = 0; i < models[id].length; i++) {                                                       //
        const tr =                                                                                      //
            `<td>                                                                                       
            <p class="object-input input-text">(</p>                                    
            <input type="number" class="object-input number-input" id=\`x-${id}-${i}\` onchange="updateInput(this)" value="${models[id][i][0].x}">
            <p class="object-input input-text">, </p>
            <input type="number" class="object-input number-input" id=\`y-${id}-${i}\` onchange="updateInput(this)" value="${models[id][i][0].y}">
            <p class="object-input input-text">, </p>
            <input type="number" class="object-input number-input" id=\`z-${id}-${i}\` onchange="updateInput(this)" value="${models[id][i][0].z}">
            <p class="object-input input-text">)</p>
        </td>
        <td>
            <input type="number" class="object-input number-input scale-input" id=\`scale-${id}-${i}\` onchange="updateInput(this)" value="${models[id][i][1]}">
        </td>
        <td>
            <input type="color" class="object-input color-input" id=\`col-${id}-${i}\` onchange="updateInput(this)" value="#${rgbValueToHex(models[id][i][2].x)}${rgbValueToHex(models[id][i][2].y)}${rgbValueToHex(models[id][i][2].z)}">
        </td>
        <td>
            <button type="button" class="object-input" id=\`${id}-${i}\` onclick="removeItem(this)">🗑</button>
        </td>`;
                                                                                                        //
        table.innerHTML += tr;                                                                          //
    }                                                                                                   // GUI
    return table;                                                                                       //
}                                                                                                       //
                                                                                                        //
// Convert a 0-255 value to hex.                                                                        //
function rgbValueToHex(value) {                                                                         //
    const hex = value.toString(16);                                                                     //
    if(hex < 10) {                                                                                      //
        return "0" + hex;                                                                               //
    }                                                                                                   //
    return hex;                                                                                         //
}                                                                                                       //
                                                                                                        //
// Called when an input field is updated, updates the models array with new value.                      //
function updateInput(ev) {                                                                              //
    const indexes = ev.id.split("-");                                                                   //
    indexes[0] = indexes[0].slice(1);                                                                   //
    indexes[2] = indexes[2].slice(0, indexes[2].length-1);                                              //
                                                                                                        //
    // Check ID of input and set correct value in the array.                                            //
    switch(indexes[0]) {                                                                                //
        case "x":                                                                                       //
            models[indexes[1]][indexes[2]][0].x = parseFloat(ev.value);                                 //
            break;                                                                                      // GUI
        case "y":                                                                                       //
            models[indexes[1]][indexes[2]][0].y = parseFloat(ev.value);                                 //
            break;                                                                                      //
        case "z":                                                                                       //
            models[indexes[1]][indexes[2]][0].z = parseFloat(ev.value);                                 //
            break;                                                                                      //
        case "scale":                                                                                   //
            models[indexes[1]][indexes[2]][1] = parseFloat(ev.value);                                   //
            break;                                                                                      //
        case "col":                                                                                     //
            models[indexes[1]][indexes[2]][2].x = parseInt(ev.value.slice(1, 3), 16);                   //
            models[indexes[1]][indexes[2]][2].y = parseInt(ev.value.slice(3, 5), 16);                   //
            models[indexes[1]][indexes[2]][2].z = parseInt(ev.value.slice(5, 7), 16);                   //
            break;                                                                                      //
    }                                                                                                   //
}                                                                                                       //
                                                                                                        //
function createAddButton(id) {                                                                          //
    const button = document.createElement("button");                                                    //
    const node = document.createTextNode("➕");                                                        // GUI
    button.appendChild(node);                                                                           //
                                                                                                        //
    button.setAttribute("class", "object-button object-add");                                           //
    button.setAttribute("id", `${id}`);                                                                 //
    button.setAttribute("onclick", "objectAdd(this)");                                                  //
    return button;                                                                                      //
}                                                                                                       //
                                                                                                        //
// Add object to the models list and update table when add buton is clicked.                            //
function objectAdd(button) {                                                                            //
    const id = parseInt(button.id);                                                                     //
    models[id].push([new Vec3(0, 0, -1.35), 0.4, new Vec3(255, 255, 255)]);                             //
                                                                                                        //
    const objectItem = document.getElementById("object-item-" + id);                                    //
                                                                                                        //
    table.remove();                                                                                     //
    table = createObjectTable(id);                                                                      //
    objectItem.appendChild(table);                                                                      //
}                                                                                                       //
                                                                                                        //
// Remove model from array and update table when remove button is clicked.                              //
function removeItem(button) {                                                                           // GUI
    const indexes = button.id.split("-");                                                               //
    indexes[0] = indexes[0].slice(1);                                                                   //
    indexes[1] = indexes[1].slice(0, indexes[1].length-1);                                              //
                                                                                                        //
    models[indexes[0]].splice(indexes[1], 1);                                                           //
                                                                                                        //
    const objectItem = document.getElementById("object-item-" + indexes[0]);                            //
                                                                                                        //
    table.remove();                                                                                     //
    table = createObjectTable(indexes[0]);                                                              //
    objectItem.appendChild(table);                                                                      //
}                                                                                                       //
                                                                                                        //
// Create a new model dropdown when new file is uploaded, add object with default position and scale.   //
function createModelDropdown(modelName) {                                                               //
    const objectContainer = document.getElementById("object-container");                                //
                                                                                                        //
    const objectDiv = document.createElement("div");                                                    //
    objectDiv.setAttribute("id", `object-item-${uploadedModels.length}`);                               //
                                                                                                        //
    const button = document.createElement("button");                                                    // GUI
    const node = document.createTextNode(`➤ ${modelName}`);                                            //
    button.appendChild(node);                                                                           //
                                                                                                        //
    button.setAttribute("type", `button`);                                                              //
    button.setAttribute("id", `${uploadedModels.length}`);                                              //
    button.setAttribute("class", `object-button object-dropdown`);                                      //
    button.setAttribute("onclick", `objectDropdown(this)`);                                             //
                                                                                                        //
    objectDiv.appendChild(button);                                                                      //
    objectContainer.appendChild(objectDiv);                                                             //
                                                                                                        //
    models.push([[new Vec3(0, 0, -1.35), 0.4, new Vec3(255, 255, 255)]]);                               //
}                                                                                                       //
// -----------------------------------------------------------------------------------------------------// GUI

// -------------------------------------------UPLOADING OBJ FILE----------------------------------------// UPLOADING OBJ FILE
                                                                                                        //
// Handle dropping model files into the drop zone.                                                      //
function dropHandler(ev) {                                                                              //
    // Prevent file from opening when dropped.                                                          //
    ev.preventDefault();                                                                                //                                                                                     //        
                                                                                                        //
    if (ev.dataTransfer.items) {                                                                        //
        // Use DataTransferItemList interface to access the file(s)                                     //
        [...ev.dataTransfer.items].forEach((item, i) => {                                               //
            // If dropped items aren't files, reject them                                               //
            if (item.kind === "file") {                                                                 //
                const file = item.getAsFile();                                                          //
                readFile(file);                                                                         //
            }                                                                                           //
        });                                                                                             //
    } else {                                                                                            //
        // Use DataTransfer interface to access the file(s)                                             //
        [...ev.dataTransfer.files].forEach((file, i) => {                                               //
            readFile(file);                                                                             //
        });                                                                                             // UPLOADING OBJ FILE
    }                                                                                                   //
                                                                                                        //
}                                                                                                       //
                                                                                                        //
// Upload file using the choose file button.                                                            //
function uploadFile(ev) {                                                                               //
    readFile(ev.target.files[0]);                                                                       //
}                                                                                                       //
                                                                                                        //
// Process the file, adding the model to the uploadedModels list and creating a dropdown button.        //
function readFile(file) {                                                                               //
    if(file == null) return;                                                                            //
                                                                                                        //
    reader = new FileReader();                                                                          //
    reader.readAsText(file);                                                                            //
                                                                                                        //
    reader.onload = function (event) {                                                                  //
        uploadedModels.push(event.target.result);                                                       //
        createModelDropdown(file.name.slice(0, file.name.length - 4));                                  //
    };                                                                                                  // UPLOADING OBJ FILE
                                                                                                        //
}                                                                                                       //
                                                                                                        //
function dragOverHandler(ev) {                                                                          //
    ev.dataTransfer.dropEffect = "move";                                                                //
                                                                                                        //
    // Prevent file from opening when dropped.                                                          //
    ev.preventDefault();                                                                                //
}                                                                                                       //
// -----------------------------------------------------------------------------------------------------// UPLOADING OBJ FILE

// ------------------------------------------------MAIN-------------------------------------------------// MAIN
                                                                                                        //
// List of objects in the scene, filled from data from gui                                              //
let spheres = new Array();                                                                              //
let objects = new Array();                                                                              //
                                                                                                        //
// List of available models files                                                                       //
let uploadedModels = [];                                                                                //
                                                                                                        //
let imageWidth = document.getElementById("canvas").width                                                //
let imageHeight = document.getElementById("canvas").height                                              //
let aspectRatio = document.getElementById("canvas").height / document.getElementById("canvas").width    //
                                                                                                        //
let viewportWidth = 2;                                                                                  //
let viewportHeight = viewportWidth * aspectRatio;                                                       //
let focalLength = 1.0;                                                                                  //
                                                                                                        //
let camPosition = new Vec3(0, 0, 0);                                                                    //
let horizontal = new Vec3(viewportWidth, 0, 0);                                                         //
let vertical = new Vec3(0, viewportHeight, 0);                                                          //
let lowerLeftCorner = camPosition.minus(horizontal.scale(0.5)).minus(vertical.scale(0.5)).minus(new Vec3(0, 0, focalLength));
                                                                                                        //
let lightDirection = new Vec3(-1.1, -1.3, -1.5).normalised();                                           // MAIN
let negLightDirection = new Vec3(-lightDirection.x, -lightDirection.y, -lightDirection.z);              //
                                                                                                        //
const c = document.getElementById("canvas");                                                            //                                           
const ctx = c.getContext("2d", { willReadFrequently: true });                                           //
                                                                                                        //
const statusText = document.getElementById("status");                                                   //
let startTime;                                                                                          //
let renderTime;                                                                                         //
                                                                                                        //
// Variables to render in chunks, frame keeps track of current chunk.                                   //
let chunkWidth = 6;                                                                                     //
let chunkAspect;                                                                                        //
let frame = 0;                                                                                          //
                                                                                                        //
if (imageWidth < imageHeight) {                                                                         //
    chunkAspect = imageHeight;                                                                          //
} else { chunkAspect = imageWidth; }                                                                    //
chunkAspect = Math.ceil(chunkAspect / chunkWidth);                                                      //
                                                                                                        //
// Function to be called to start generating the image.                                                 // MAIN
function generate() {                                                                                   //
    startTime = new Date().getTime();                                                                   //
                                                                                                        //
    // Clear the object arrays.                                                                         //
    objects = [];                                                                                       //
    spheres = [];                                                                                       //
                                                                                                        //
    // Fill the arrays with spheres and the 3d models.                                                  //
    for(let i = 0; i < models.length; i++) {                                                            //
        for(let j = 0; j < models[i].length; j++) {                                                     //
            if(i == 0) {                                                                                //
                spheres.push(new Sphere(models[i][j][0], models[i][j][1], models[i][j][2].scale(1/255)));
                continue;                                                                               //
            }                                                                                           //
                                                                                                        //
            openModel(uploadedModels[i-1], models[i][j][1], models[i][j][0], models[i][j][2].scale(1/255));
        }                                                                                               //
    }                                                                                                   //
                                                                                                        //
    // Update the status text, clear the canvas and begin rendering.                                    // MAIN
    statusText.innerHTML = `RENDERING...`;                                                              //
    ctx.clearRect(0, 0, canvas.width, canvas.height);                                                   //
    window.requestAnimationFrame(render);                                                               //
}                                                                                                       //
                                                                                                        //
// Loop over each pixel in the canvas and set the colour from a ray shooting through the centre of it.  //
function render() {                                                                                     //
    jchunk = frame % chunkWidth;                                                                        //
    ichunk = Math.floor(frame / chunkWidth);                                                            //
                                                                                                        //
    // Loop through each pixel in a chunk.                                                              //
    for (let i = ichunk * chunkAspect; i < ichunk * chunkAspect + chunkAspect && i <= imageWidth; i++) {
        for (let j = jchunk * chunkAspect; j < jchunk * chunkAspect + chunkAspect && j <= imageHeight; j++) {
            let colour = new Vec3(0, 0, 0)                                                              //
                                                                                                        //
            let u = i / (imageWidth);                                                                   //
            let v = j / (imageHeight);                                                                  //
            let ray = new Ray(camPosition, lowerLeftCorner.add(horizontal.scale(u)).add(vertical.scale(v)).minus(camPosition));
            colour = rayColour(ray).scale(255);                                                         //
                                                                                                        // MAIN
            setPixel(i, j, colour);                                                                     //
        }                                                                                               //
    }                                                                                                   //
                                                                                                        //
    // Check if render has finished and then call edge detect for anti-aliasing.                        //
    if (ichunk < chunkWidth) {                                                                          //
        frame++;                                                                                        //
        window.requestAnimationFrame(render);                                                           //
    } else {                                                                                            //
        frame = 0;                                                                                      //
        statusText.innerHTML = `DETECTING EDGES...`;                                                    //
        window.requestAnimationFrame(edgeDetect);                                                       //
    }                                                                                                   //
}                                                                                                       //
                                                                                                        //
// A set to keep track of pixels requiring anti-aliasing.                                               //
let aliasPixels;                                                                                        //
                                                                                                        //
// Detect edges in the image to find the pixels that need anti-aliasing.                                //
function edgeDetect() {                                                                                 // MAIN
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;                              //
    aliasPixels = new Set();                                                                            //
                                                                                                        //
    // Check difference in colour with pixel above and to the right of each pixel.                      //
    for (let i = 0; i < imageWidth; i++) {                                                              //
        for (let j = 0; j <= imageHeight; j++) {                                                        //
            let pixelA = (imageWidth * (imageHeight - j) + i) * 4;                                      //
            colourA = new Vec3(data[pixelA], data[pixelA + 1], data[pixelA + 2]);                       //
                                                                                                        //
            let pixelB = (imageWidth * (imageHeight - j + 1) + i) * 4;                                  //
            colourB = new Vec3(data[pixelB], data[pixelB + 1], data[pixelB + 2]);                       //
                                                                                                        //  
            let pixelC = (imageWidth * (imageHeight - j) + i + 1) * 4;                                  //
            colourC = new Vec3(data[pixelC], data[pixelC + 1], data[pixelC + 2]);                       //
                                                                                                        //
            if ((colourA.x - colourB.x) ** 2 > 9 ||                                                     //
                (colourA.y - colourB.y) ** 2 > 9 ||                                                     //
                (colourA.z - colourB.z) ** 2 > 9 ||                                                     //
                (colourA.x - colourC.x) ** 2 > 9 ||                                                     //
                (colourA.y - colourC.y) ** 2 > 9 ||                                                     // MAIN
                (colourA.z - colourC.z) ** 2 > 9) {                                                     //
                setPixel(i, j, new Vec3(0, 0, 0));                                                      //
                setPixel(i, j + 1, new Vec3(0, 0, 0));                                                  //
                setPixel(i, j - 1, new Vec3(0, 0, 0));                                                  //
                setPixel(i + 1, j, new Vec3(0, 0, 0));                                                  //
                setPixel(i - 1, j, new Vec3(0, 0, 0));                                                  //
                aliasPixels.add([i, j + 1]);                                                            //
                aliasPixels.add([i, j - 1]);                                                            //
                aliasPixels.add([i, j]);                                                                //
                aliasPixels.add([i + 1, j]);                                                            //
                aliasPixels.add([i - 1, j]);                                                            //
            }                                                                                           //
                                                                                                        //
        }                                                                                               //
    }                                                                                                   //
    window.requestAnimationFrame(estimateTime)                                                          //
}                                                                                                       //
                                                                                                        //
// Estimate the time it will take the anti-aliasing to complete based on render time of scene.          //
function estimateTime() {                                                                               // MAIN
    const aliasSamples = 3;                                                                             //
    renderTime = new Date().getTime();                                                                  //
    renderTime -= startTime;                                                                            //
                                                                                                        //
    timePerRay = renderTime / (imageWidth * imageHeight);                                               //
                                                                                                        //
    // Estimate the time by taking                                                                      //
    // number of pixels * number of rays per pixel * time per ray * 1.3                                 //
    // aliasSamples**2 = number of rays per pixel                                                       //
    statusText.innerHTML = `ANTI_ALIASING... [Estimated ${Math.round((aliasPixels.size * aliasSamples**2 * timePerRay) * 1.3 / 10) / 100}s]`;
                                                                                                        //
    window.requestAnimationFrame(function () {                                                          //
        antialias(aliasSamples);                                                                        //
    });                                                                                                 //
}                                                                                                       //
                                                                                                        //
// Anti-aliasing                                                                                        //
function antialias(aliasSamples) {                                                                      // 
    // Loop over each pixel in the set, shoot a grid of rays within the pixel and average the result.   //
    for (pixels of aliasPixels) {                                                                       // MAIN
        let colour = new Vec3(0, 0, 0)                                                                  //
                                                                                                        //
        for (let a = 0; a < aliasSamples; a++) {                                                        //
            for (let b = 0; b < aliasSamples; b++) {                                                    //
                let u = (pixels[0] + a / aliasSamples) / (imageWidth - 1);                              //
                let v = (pixels[1] + b / aliasSamples) / (imageHeight - 1);                             //
                let ray = new Ray(camPosition, lowerLeftCorner.add(horizontal.scale(u)).add(vertical.scale(v)).minus(camPosition));
                colour = colour.add(rayColour(ray));                                                    //
            }                                                                                           //
        }                                                                                               //
                                                                                                        //
        colour = colour.scale(1 / (aliasSamples * aliasSamples)).scale(255);                            //
                                                                                                        //
        setPixel(pixels[0], pixels[1], colour);                                                         //
    }                                                                                                   //
                                                                                                        //
    statusText.innerHTML = `Finished in ${Math.round((new Date().getTime() - startTime) / 10) /100}s`;  //
}                                                                                                       //
                                                                                                        //
generate();                                                                                             //
// -----------------------------------------------------------------------------------------------------// MAIN