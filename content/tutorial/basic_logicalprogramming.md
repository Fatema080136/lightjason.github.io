---
title: "Basic Knowledge: Logical Programming"
---
This tutorial gives a short introduction in [logical programming concepts](https://en.wikipedia.org/wiki/Logic_programming), which are needed to write the source code of an agent.

## <a name="designtime">Designtime</a>

On logical programms we are talking about a _symbolic definition_. We are writing source code in _symbols_, _facts_ and _rules_. The difference between [imperative programming](https://en.wikipedia.org/wiki/Imperative_programming) and a logical programm is, that we don't define _how the problem should be solved_. We define only the facts and rules which are needed to calculate the solution. In a more general way we define the _constraints_ which are needed to solve the problem. On this definition the runtime create an internal structure to solve the problem.

On the agent developing process, you have to write an _agent script_ in our AgentSpeak(L) programming language, which describes the behaviour of the agent. The script describs _what and when should the agent do_. This process is named _designtime_, because you design the behaviour without knowledge about the real execution process. During _designtime_ there are some concepts to understand the structure of our logical programming language, which are shown here...


### <a name="terms">Terms</a>

In short: _Everything is a term_
All elements within the source code are terms, so the super (generic) data structure is a term. In our framework we are distinguish two different types of terms:

* raw terms are terms with a native Java datatype, in such a term any Java data structure can be stored, but it cannot be used by the normal behaviour of the logical programming language. Unifying and assigments are possible on these raw data structures
* other terms like literals are structured objects which are here described

In our structure we create an inheritance model to build the software architecture for these structured. The root element is the [ITerm interface](https://lightjason.github.io/AgentSpeak/sources/d9/d34/interfaceorg_1_1lightjason_1_1agentspeak_1_1language_1_1ITerm.html) and the {{< lightbox "https://lightjason.github.io/AgentSpeak/sources/d4/dc1/interfaceorg_1_1lightjason_1_1agentspeak_1_1language_1_1ITerm__inherit__graph_org.svg" "ITerm inheritance diagram" >}} shows the structure of the relations.

### <a name="atomliterals">Atom & Literals</a>

The plainest structure of a logical programming language are _atoms_ and based on this structure the _literals_. In the Prolog definition and so in AgentSpeak(L) all literals / atoms are beginning with a lower-case letter. In our definition the atom can be also contains shalsh ```/``` and ```-```. For example:

> We would like to define that the sun is shining
> <pre><code class="lightjason">sun( shining() )</pre></code>
> The word ```sun``` and the word ```shining``` are _atoms_, the whole structure ```sun(shining())``` is named _literal_.

<a name="time"></a>Another example is a time definition:

> We would like to say it is currently 2 a clock post meridiam (pm)
> <pre><code class="lightjason">time( current( hour(2), minute(0), pm() ) )</pre></code>
> You can see, that a literal can store a list of other literals or values inside the brackets.

Based on the first example a negation is also possible

> We would to say it is currently not raining
> <pre><code class="lightjason">~raining()</pre></code>
> The tilde ```~``` in front of a atom defines the [strong negation](https://en.wikipedia.org/wiki/Stable_model_semantics#Strong_negation)

### <a name="variables">Variables</a>

Variables can be used to define literals with a _placeholder_ and in constrast to atom / literals begins a variable with an upper-case letter. 

> Based on the [time example](#time) we add some variables to extract the hour and minute part of the literal
> <pre><code class="lightjason">time( current( hour( Hour ), minute( Minute ), pm() ) )</code></pre>
> The upper-case variables ```Hour``` and ```Minute``` are parts of the literal and the system can set the values into. This structure is named [unification](#unification)

Within a logical programming language exists a specialized variable which is _only_ the underscore ```_```. This variable can be sloppy named as _trash can_. You can use this special variable for defining a variable which value should be ignored.

> In contradistinction to the time example above, we would like to ignore the ```pm()``` part, so we say, that we would like to get the current time and ignoring the 12-hour clock part
> <pre><code class="lightjason">time( current( hour( Hour ), minute( Minute ), _ ) )</code></pre>
> With this definition we can get a very flexible structure for extracting some information from the literals.

### <a name="factsbeliefs">Facts & Beliefs</a>

Based on the definition of [variables](#variables) and [literals](#atomliterals) we are defining a _fact_ as a _literal without variables_. A fact is a literal which define a state or an information (independed the information is correct or wrong). In relation to a multi-agent system a _belief_ is a _fact about the knowledge or the environment_. So the fact defines a state or a point of view of an object without any information about the correctness.

### <a name="rulesdesigntime">Rules</a>

Rules as distinct from [literals](#atomliterals), [variables](#variables) and [facts](#factbeliefs) are an _executable structure_. Rules can be looked upon as a _static function_, but on a logical programming language a function with some additional structure.



## <a name="runtime">Runtime</a>

In the section [designtime](#designtime) we are talking about a symbolic representation of data. We can define such data in the agent script and during the execution of the agent we would like to modify the data. On an abstract point of view are arte talking about [deductive reasoning](https://en.wikipedia.org/wiki/Deductive_reasoning), that means in slopping sentence: _We are generating new knowledge, based on the current knowledge of the agent_.
![deduction](../../images/deduction.png#centering)
The description of the figure is that we are modeling the $\Delta$ during [designtime](#designtime) with any kind of [facts](#factbeliefs). During runtime the agent can modify the knowledge and generates implicit knowledge about the environment which is based on the previous knowledge $\Delta$. The implicit knowledge is named $belief(\Delta, \rho)$


### <a name="logical">Logical</a>

### <a name="unification">Unifaction</a>

### <a name="rulesruntime">Rules</a>


