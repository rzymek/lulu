.ONESHELL:
deploy: clean
	yarn build
	rsync public/* build/
	cd build
	git init
	git add :/
	git commit -m 'deploy'
	git remote add github git@github.com:rzymek/lulu.git
	git push github HEAD:gh-pages --force
clean:
	rm -rf build/
