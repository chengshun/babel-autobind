function createFunctionBind(t, name, method) {
	return t.expressionStatement(
		t.assignmentExpression(
			'=',
			t.memberExpression(
				t.thisExpression(),
				t.Identifier(name)
			),
			t.callExpression(
				t.memberExpression(
					t.memberExpression(
						t.thisExpression(),
						t.Identifier(name)
					),
					t.Identifier('bind')
				),
				[t.thisExpression()]
			)
		)
	);
}

function createSuper(t){
	return t.expressionStatement(
			t.callExpression(
				t.super(),
				[t.Identifier('props')]
			)
		);
}

module.exports = function({ types: t }){

	return {
		visitor: {
			ClassDeclaration(path) {
				let constructor = null;
				const body = path.node.body.body;
				//遍历classMethod
				const filterConstructor = body.filter(method =>  t.isClassMethod(method) && method.kind === 'constructor');

				//遍历所有classMethod，过滤constructor之后
				const methods = body.filter(method => t.isClassMethod(method) && method.kind !== 'constructor');
				const methodNames = methods.map(method => method.key.name);

				//如果没有constructor，就添加constructor
				if (!filterConstructor.length) {
					const bindFuncs = methodNames.map((name) => createFunctionBind(t, name));
					const superFunc = createSuper(t);

					bindFuncs.unshift(superFunc);
					constructor = t.classMethod(
						'constructor',
						t.Identifier('constructor'),
						[t.Identifier('props')],
						t.blockStatement(
							bindFuncs
						)
					);
					//methods.map((method) => createFunctionBind(method.kind));
					body.unshift(constructor);
				} else {
					constructor = filterConstructor[0];
					//找出已在constructor中手动bind过的函数名
					const constructorBody = constructor.body.body;
					const bindedMethods = constructorBody.filter((method) => 
						t.isExpressionStatement(method) && 
						t.isAssignmentExpression(method.expression) && 
						t.isCallExpression(method.expression.right)
					);
					const bindedMethodNames = bindedMethods.map((method) => {
						return method.expression.left.property.name;
					});

					let finalBindFuncs = [];

					methodNames.forEach((methodName) => {
						if (bindedMethodNames.indexOf(methodName) === -1) {
							constructorBody.push(createFunctionBind(t, methodName));
						}
					});
				}
			}
		}
	}
}