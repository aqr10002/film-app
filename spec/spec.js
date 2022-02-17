 

describe('Website', () => {

     
    describe('Main Navigation Behaviour', () => {

        
        it('should call the API to fetch Movie Data', () => {
            let fetchTMDbData = spyOn(window,'fetchTMDbData');
			nav('movies,popular');
			expect(fetchTMDbData).toHaveBeenCalled();
        });

        
        it('create secondry navigation and manage active classes', () => {
            let manageSecondaryNav = spyOn(window,'manageSecondaryNav');
            let  manageActiveClass = spyOn(window,'manageActiveClass');
			nav('tvshows,on_the_air');
			expect(manageSecondaryNav).toHaveBeenCalled();
			expect(manageActiveClass).toHaveBeenCalled();
        });
    });

 
    describe('Search Behaviour', () => {
        let searchInput = document.getElementById('search-input');

        it('should do nothing', () => {
            searchInput.value = 'the';
            let getTMDbSearchData = spyOn(window, 'getTMDbSearchData');
            getSearchInput();
            expect(getTMDbSearchData).not.toHaveBeenCalled();
        });

        it('should call the tmdb search route', () => {
            searchInput.value = 'the simpsons';
            let getTMDbSearchData = spyOn(window, 'getTMDbSearchData');
            getSearchInput();
            expect(getTMDbSearchData).toHaveBeenCalled();
        });
    });
 

    describe('Content gets called and correct data is returned', () => {
        let showContentResults;

        beforeEach(function() {
            showContentResults = spyOn(window, 'showContentResults');
            nav('movies,popular');
            jasmine.clock().install();
        });
          
        afterEach(function() {
            jasmine.clock().uninstall();
        });
          
   
        it("calls a function to iterate and display the data", function() {
            setTimeout(function() {
                showContentResults();
            }, 100);
            jasmine.clock().tick(1000);
            
            
            expect(showContentResults).toHaveBeenCalled();
        });

        
        it('sets the correct result', () => {
            expect(typeof(state.results)).toBe('object');
            expect(state.results.title).toBe('Kung Fu League');
        }); 
    });


   
    describe('Content gets called and correct data is returned', () => {
        let showSearchResults;

        beforeEach(function() {
            showSearchResults = spyOn(window, 'showSearchResults');
            getTMDbSearchData('the simpsons');
            jasmine.clock().install();
        });
          
        afterEach(function() {
            jasmine.clock().uninstall();
        });
          
         
        it("calls a function to iterate and display the data", function() {
            setTimeout(function() {
                showSearchResults();
            }, 100);
            jasmine.clock().tick(1000);
            
            
            expect(showSearchResults).toHaveBeenCalled();
        });

        
        it('sets the correct result', () => {
            expect(typeof(state.searchResults)).toBe('object');
            expect(state.searchResults).toContain('The Simpsons');
            expect(state.searchResults.length).toBeGreaterThan(2);
        }); 
    });


     
    describe('My Lists', () => {

        
        it('Should call my lists', () => {
            let showMyLists = spyOn(window, 'showMyLists');
            nav('mylists,null');
            expect(showMyLists).toHaveBeenCalled();
        });

        
        it('should add a list', () => {
            let input = document.getElementById('mylists-add-new-list-input');
            openAddNewList('#mylists-add-new-list');
            input.value = 'Test New List';
            addNewList('#mylists-add-new-list','#mylists-add-new-list-input');
            expect(typeof(state.mylists.test_new_list)).toBe('object');
            expect(state.mylists.test_new_list.length).toBe(0);
        });
    });
}); 


