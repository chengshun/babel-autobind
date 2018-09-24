var babel = require('babel-core');
var plugin = require('../main');
var classPlugin = require('babel-plugin-transform-class-properties');
var env = require('babel-preset-env');
var react = require('babel-preset-react');

var test1 = `class App extends Component{
	handleClick() {}
}`;

var test2 = `class App extends Component{
	constructor(props) {
		super(props);
	}
	handleClick() {}
}`;

var test3 = `class App extends Component{
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick() {}
}`;

var test4 = `class App extends Component{
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick() {}
	handleChange() {}
}`;

var test5 = `class App extends Component{
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick() {}
	handleChange() {}
}
class Test extends Component {
	handleSelect() {}
}`;


var test6 = `class App extends Component{
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	componentDidMount() {}
	handleClick() {}
	handleChange() {}
}`;

it('对单个没有constructor的class里的方法添加bind', () => {
	const { code } = babel.transform(test1, {
		plugins: [classPlugin, plugin],
		presets: [react, env] 
	});

	expect(code).toMatchSnapshot();
});

it('对单个有constructor的class里的方法添加bind', () => {
	const { code } = babel.transform(test2, {
		plugins: [classPlugin, plugin],
		presets: [react, env] 
	});

	expect(code).toMatchSnapshot();
});

it('对已经bind过的函数不处理', () => {
	const { code } = babel.transform(test3, {
		plugins: [classPlugin, plugin],
		presets: [react, env] 
	});

	expect(code).toMatchSnapshot();
});

it('对已经bind过的函数不处理, 没有bind的函数进行bind', () => {
	const { code } = babel.transform(test4, {
		plugins: [classPlugin, plugin],
		presets: [react, env] 
	});

	expect(code).toMatchSnapshot();
});

it('对多个class里的函数，分别bind，互不影响', () => {
	const { code } = babel.transform(test5, {
		plugins: [classPlugin, plugin],
		presets: [react, env] 
	});

	expect(code).toMatchSnapshot();	
});
 
it('忽略react生命周期方法', () => {
	const { code } = babel.transform(test6, {
		plugins: [classPlugin, plugin],
		presets: [react, env] 
	});

	expect(code).toMatchSnapshot();		
});