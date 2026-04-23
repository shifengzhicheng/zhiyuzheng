---
layout: post
title: Sensitivity Analysis in Analog Circuits
date: 2025-04-23 00:00:00+0800
description: Notes on linear and nonlinear circuit sensitivity analysis, from MNA-based perturbation formulas to large-change DC cases such as open and short conditions.
tags: [circuit-modeling, sensitivity-analysis, analog]
---

# Sensitivity Analysis in Analog Circuits

Sensitivity analysis studies how uncertainty in the output of a mathematical model or physical system can be attributed to different sources of uncertainty in its inputs. In practice, it is often used to evaluate robustness, understand input-output relationships, identify truly important parameters, reduce unnecessary calibration effort, and detect redundancy in a model.

In the context of circuit analysis, sensitivity analysis asks a very concrete question: when device parameters, excitations, or interconnections change, how does the circuit solution change, how large is that change, and where does it appear in node voltages or branch currents?

This article focuses on two problems:

1. How should sensitivity analysis be performed for nonlinear circuits when parameter variations are small?
2. How should nonlinear circuits be analyzed in large-change DC scenarios such as open circuits and short circuits?

Before discussing nonlinear circuits, it is helpful to begin with the most basic case: sensitivity analysis for linear circuits.

## 1. Basic Sensitivity Analysis for Linear Circuits

Consider the modified nodal analysis (MNA) equation of a linear circuit:

\[
M x = b,
\qquad
M \in \mathbb{R}^{n \times n},
\quad
x \in \mathbb{R}^{n \times 1},
\quad
b \in \mathbb{R}^{n \times 1}.
\]

If the system matrix \(M\) and the right-hand side \(b\) both contain small perturbations, then the actual equation being solved can be written as

\[
(M + \delta M)(x + \delta x) = b + \delta b.
\]

The nominal solution satisfies

\[
Mx = b.
\]

Neglecting higher-order terms gives

\[
\delta x = M^{-1}(-\delta M \cdot x + \delta b).
\]

This is the key result for the linear case. It shows that sensitivity analysis is fundamentally about how perturbations in \(M\) and \(b\) propagate to the perturbation in the solution vector \(x\).

Now let

\[
x = [x_1, x_2, \dots, x_n]^T,
\qquad
\delta x = [\delta x_1, \delta x_2, \dots, \delta x_n]^T.
\]

We can further refine the result to describe how one component of the solution depends on one entry of the matrix or one entry of the excitation vector.

Let \(\xi_i^T\) denote the \(i\)-th row of \(M^{-1}\). Then

\[
\delta x_i
=
\xi_i^T(-\delta M \cdot x + \delta b)
=
\sum_{k,l} -\xi_{ik}\delta M_{kl}x_l
+ \sum_j \xi_{ij}\delta b_j.
\]

Therefore,

\[
\frac{\partial x_i}{\partial M_{kl}} = -\xi_{ik}x_l,
\qquad
\frac{\partial x_i}{\partial b_j} = \xi_{ij}.
\]

These expressions make the local sensitivity of a linear circuit completely explicit. They tell us how a particular matrix entry or excitation term influences a particular component of the solution vector. In other words, once \(M^{-1}\) and the nominal solution \(x\) are known, the local sensitivity can be computed directly.

This also illustrates an important conceptual point: sensitivity analysis is not merely an interpretive step added after simulation. It is already embedded in the structure of the circuit equations themselves.

## 2. A Perturbation-Based View of Sensitivity Analysis for Nonlinear Circuits

We now turn to the first main question: how should sensitivity analysis be performed for nonlinear circuits when parameter variations are small?

The nonlinear case is much more complicated than the linear one. In a linear circuit, the matrix \(M\) and the vector \(b\) are fixed during the solve. In a nonlinear circuit, however, both depend on the current solution estimate. Device parameters influence the matrices generated during iteration, and the current iterate in turn affects the next linearized system.

As a result, what sensitivity analysis truly concerns in the nonlinear case is this: how sensitive is the final converged operating point to changes in device parameters?

### 2.1 Problem Formulation

A typical DC solve for a nonlinear circuit can be abstracted as follows:

1. Start from an initial guess \(x^{(0)}\).
2. Use the current solution estimate and device parameters to construct a linearized matrix \(M\) and vector \(b\).
3. Solve the current linearized system to obtain a new \(x\).
4. Update \(M\) and \(b\) using the new \(x\).
5. Repeat until convergence.

Let \(p\) denote the vector of device parameters. During the linearization process, both \(M\) and \(b\) depend on \(x\) and \(p\). Once the iteration converges, it is natural to interpret the final solution as a mapping

\[
x = h(p).
\]

This viewpoint is essential. It tells us that nonlinear sensitivity analysis should not focus on the behavior of one intermediate linearization step in isolation, but rather on how the final converged solution depends locally on the parameter vector \(p\).

From this perspective, several conclusions follow naturally:

- Changes in the final result originate from changes in parameters.
- Intermediate matrices are part of the solution process, but the final converged solution is the real object of interest.
- If convergence is stable and the operating point is unique, then the final solution can be viewed as a local mapping from parameters to the solution vector.

This does not mean that the intermediate iterates are irrelevant. Instead, it means that once convergence has been achieved, the appropriate object for sensitivity analysis is the dependence of the final operating point on circuit parameters.

### 2.2 Local Approximation by Small Perturbations

Once we regard the final solution as \(x = h(p)\), the most natural next step is to perturb the parameters slightly and approximate the resulting derivative numerically.

#### 2.2.1 Sensitivity with Respect to a Single Parameter

Suppose we want to analyze the effect of one parameter \(p_i\). We replace it with \(p_i + \Delta p_i\), rerun the nonlinear solve, and obtain a new solution \(x'\). Then we approximate

\[
\frac{\partial x}{\partial p_i}
\approx
\frac{x' - x}{\Delta p_i}.
\]

From an implementation standpoint, this is straightforward:

- modify one parameter in the netlist,
- solve the circuit again,
- subtract the old solution from the new one,
- divide by the perturbation size.

This gives an approximate sensitivity of every component of the solution vector with respect to that parameter.

#### 2.2.2 The Jacobian with Respect to a Parameter Vector

If the scalar parameter is generalized to a vector \(p\), then what we ideally want is the Jacobian

\[
J_h(p) = \frac{\partial x}{\partial p}.
\]

Each column of this Jacobian represents the influence of one parameter on the entire solution vector. Each row describes the sensitivity of one solution component to all parameters.

From an interpretive standpoint, this Jacobian answers the central question of nonlinear sensitivity analysis: it characterizes how local changes in the parameter vector propagate to the final converged solution.

### 2.3 Finite Differences and Circuit-Based Methods

The most direct numerical approach is finite difference: perturb each parameter independently, solve the nonlinear system again, and assemble the resulting columns into the full Jacobian.

This method is intuitive and easy to implement, but it is also expensive. If there are many parameters, and each perturbation requires a full nonlinear solve, then the overall cost becomes large.

A more efficient idea is to return, locally, to a linearized circuit picture. Near the final operating point, a small parameter change induces small changes in the linearized matrix and right-hand side. Under this local approximation, we may write

\[
\delta x
=
M^{-1}
\left(
-\frac{\partial M}{\partial p}x
+ \frac{\partial b}{\partial p}
\right)
\delta p.
\]

This reduces the problem to two subproblems:

1. how to compute \(\partial M / \partial p\),
2. how to compute \(\partial b / \partial p\).

Mathematically, this formula is very natural. In practice, however, the real challenge is that the linearized companion model of a nonlinear device depends on both the device parameters and the operating point. That dependence is not always easy to express in a neat closed form.

So a balanced view is the following:

- finite-difference methods are simple and practical;
- circuit-based methods are potentially much more efficient for computing the Jacobian;
- the real difficulty lies not in the final formula, but in constructing \(\partial M / \partial p\) and \(\partial b / \partial p\) accurately.

## 3. DC Analysis Under Large Structural Changes

The discussion above concerns small parameter perturbations. We now move to the second question: how should one analyze nonlinear circuits in large-change DC scenarios such as open circuits and short circuits?

The essential difference is that the change is no longer just a small variation in parameter values. Instead, the structure of the circuit itself changes. In such cases, differential sensitivity is often no longer the most natural object. What matters more directly is the difference between the solution before and after the structural change.

### 3.1 Short Circuits and Open Circuits in Linear Circuits

Let us begin again with the linear case. In linear circuits, open circuits and short circuits can be analyzed using the substitution theorem, superposition, and port-equivalent arguments.

The substitution theorem states that if the voltage or current of a branch is known, then, assuming a unique solution exists, that branch may be replaced by an independent voltage source or current source of the same value without affecting the rest of the network.

#### 3.1.1 Short Circuits in Linear Circuits

Consider the MNA equation

\[
Mx = b.
\]

Suppose we are interested in shorting the port \((a,b)\). Construct a selector vector \(s\) such that

\[
s^T x = v_a - v_b.
\]

If the port is shorted, then the constraint is

\[
s^T x = 0.
\]

A direct MNA formulation is to place an ideal 0V voltage source across the port. The augmented system becomes

\[
\begin{bmatrix}
M & s \
s^T & 0
\end{bmatrix}
\begin{bmatrix}
x' \
i_s
\end{bmatrix}
=
\begin{bmatrix}
b \
0
\end{bmatrix},
\]

where \(i_s\) is the current through the added voltage source.

If we further want the equivalent resistance seen at this port, we can suppress all independent sources and inject a test current \(I_t\). Then

\[
Mx_t = I_t s.
\]

The port voltage is

\[
v_t = s^T x_t = I_t s^T M^{-1} s.
\]

Hence the equivalent resistance is

\[
R_{\mathrm{eq}} = \frac{v_t}{I_t} = s^T M^{-1} s.
\]

This result is useful because once the port behavior is expressed in terms of an equivalent resistance, not only a perfect short but also any finite resistor connected at the port can be analyzed in essentially the same framework.

If the added branch introduces a current perturbation \(\Delta i\) at the port, then the global change in the solution satisfies

\[
M \Delta x = \Delta i \, s,
\qquad
\Delta x = M^{-1}s \, \Delta i.
\]

So from a structural point of view, a short circuit can be interpreted as a structured excitation applied at a port, and the key question becomes how that excitation propagates through the linear network.

#### 3.1.2 Open Circuits in Linear Circuits

The open-circuit case can be treated similarly. Suppose the contribution of a device to the system matrix is \(A\). Then the original circuit equation may be written as

\[
(M + A)x = b.
\]

If that device is opened, its contribution is removed, and the new equation becomes

\[
M x_{\mathrm{open}} = b.
\]

The difference between the original solution and the open-circuit solution then satisfies

\[
M(x - x_{\mathrm{open}}) = A x,
\]

which implies

\[
x - x_{\mathrm{open}} = M^{-1} A x.
\]

This expression shows that an open circuit can also be viewed as a structured perturbation, except that the perturbation now comes from removing a branch contribution.

If the branch is not ideally open but replaced by a finite resistor \(R\), then the problem can again be mapped to the port-based framework used above. One first solves the open-circuit case, then treats the newly connected branch as an additional excitation and computes its correction \(\Delta x_R\), yielding

\[
x_R = x_{\mathrm{open}} + \Delta x_R.
\]

Thus, in linear circuits, short circuits, open circuits, and finite added resistors can all be understood in a unified way: structural changes are turned into explicit perturbations of the linear system, and their influence on the solution is then analyzed.

### 3.2 Large Changes in Nonlinear Circuits

For nonlinear circuits, the linear equivalent analysis above cannot be applied directly. The reason is simple: once a large structural change such as an open or short occurs, the operating point itself may shift significantly, and the linearized companion models of the nonlinear devices will also change accordingly.

In this situation, it is more natural to define the quantity of interest as the difference between the converged solutions before and after the change:

\[
\Delta x = x' - x,
\]

where \(x\) is the original converged solution and \(x'\) is the new converged solution after the open or short.

From an implementation point of view, the procedure is straightforward:

1. Solve the original circuit to obtain \(x\).
2. Modify the circuit structure, for example by opening a branch or shorting a port.
3. Solve the modified circuit to obtain \(x'\).
4. Compute the difference \(\Delta x = x' - x\).

From a modeling perspective, however, it is important to recognize what has actually changed. The device parameters \(p\) may remain the same. What changes is the mapping that constructs the MNA system from the device models and the circuit connectivity.

In other words, large-change sensitivity in nonlinear circuits depends not only on the parameter vector \(p\), but also on the circuit connectivity itself. If we denote the connectivity by \(c\), then the original solution may be written abstractly as

\[
x = h(p, c).
\]

After an open or short, the connectivity changes to \(c'\), and the new solution becomes

\[
x' = h(p, c').
\]

The resulting sensitivity vector is then

\[
\Delta x = h(p, c') - h(p, c).
\]

This expression does not fully resolve all mathematical details, but it identifies the correct object that changes in large-signal structural analysis: not merely the parameter values, but the circuit topology and the equation-generation process associated with that topology.

## 4. An Implementation-Oriented Perspective

One issue we have not fully unpacked so far is how a nonlinear device actually generates a new linearized contribution during each iteration.

From an implementation point of view, the process can be understood as follows:

1. Given the nonlinear device type, its parameters, and the current operating point, generate a local linearized model.
2. Stamp that local model into the global MNA equation.
3. Solve the resulting linear system.
4. Repeat until convergence.

In a more abstract form, the process consists of several layers of mapping:

- extract the port variables of a nonlinear device from the global solution vector,
- use those port variables and device parameters to build a local linearized model,
- stamp that local model back into the global MNA system.

In actual code, one typically does not write all of this as explicit matrix multiplications. Instead, one implements it through stamping. A rough pseudocode sketch is

```text
for d in NonlinearDevices:
    linear_net = GenerateLinearNet(d.type, d.p, x)
    [M_d, b_d] = PasteLinearNet(d.port, linear_net)
    M = M + M_d
    b = b + b_d
```

This viewpoint is useful because it unifies the two types of analysis discussed earlier:

- in the small-perturbation case, sensitivity analysis asks how a change in parameters \(p\) alters this stamping process;
- in the large-change open/short case, sensitivity analysis asks how a change in connectivity \(c\) alters this stamping process.

Ultimately, both problems reduce to the same core question: how is the new MNA equation generated?

From a software perspective, that is the truly central issue. The final subtraction \(x' - x\) or the final derivative formula is not the hardest part. The hard part is correctly generating and stamping the linearized device contributions into the global system.

## 5. Conclusion

This article has tried to make the following points clear.

First, in linear circuits, sensitivity analysis can be derived directly from the MNA equation, and the result can be refined down to the effect of a single matrix entry or excitation term on a single component of the solution.

Second, for nonlinear circuits under small parameter variations, the most natural viewpoint is to regard the converged operating point as a mapping from the parameter vector to the solution vector, and then analyze the local Jacobian of that mapping. The most direct method is finite difference, while a more advanced method is to construct \(\partial M / \partial p\) and \(\partial b / \partial p\).

Third, for large-change DC problems such as open circuits and short circuits, especially in nonlinear circuits, the main object of interest is no longer an infinitesimal derivative, but the difference between the converged solutions before and after the structural change. This is because what changes is not only a numerical parameter, but also the circuit connectivity and therefore the way in which the governing equations are generated.

Finally, from an implementation standpoint, all of these problems point to the same central task: how to stamp the correct local companion model of a nonlinear device into the MNA equation as a function of device parameters, operating point, and connectivity. Once that mechanism is made clear, both small-signal sensitivity analysis and large-change DC analysis become much more natural.

## References

- Fudan University Analog EDA course slides: `PPT202307_adjoint_v02`
- Fudan University Analog EDA course slides: `PPT202301_DCMNA_v02`
- Fudan University Analog EDA course slides: `PPT202302_linearDC_v04`
- Fudan University Analog EDA course slides: `PPT202303_nonlinearDC_v01`
