uniform vec3 u_colorPrimary;
uniform vec3 u_colorSecondary;
varying vec2 vUv;

void main() {
    vec3 color = mix(u_colorPrimary, u_colorSecondary, vUv.y);
    gl_FragColor = vec4(color, 1.0);
}