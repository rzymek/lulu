dev: build
	yarn start

build:
	yarn build
	rsync public/* build/
	
.ONESHELL:
deploy: clean build
	cd build
	git init
	git add :/
	git commit -m 'deploy'
	git remote add github git@github.com:rzymek/lulu.git
	git push github HEAD:gh-pages --force

clean:
	rm -rf build/
