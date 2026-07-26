# Smart Notes & FAQ Assistant 
 
Pitch: Students take notes across sessions and forget where they wrote things, or re-answer the same question twice. This tool lets a user save notes, search them by keyword, and store FAQ answers for instant reuse. 
 
Tool Inventory: 
add_note - saves a note with tags - P0 
search_notes - searches notes by keyword - P0 
get_faq_answer - returns saved answer to a repeated question - P0 
add_faq - saves a question and answer - P1 
list_notes - lists all notes - P1 
delete_note - deletes a note by id - P1 
 
Out of Scope: no AI generated answers, no user accounts, no paid APIs, no mobile app. 
 
Success Criteria: search_notes finds fixture notes by keyword. get_faq_answer returns saved answers. All P0 tools appear in MCP Inspector. 
 
Risks: search matching may be inaccurate - mitigation is testing with sample notes. Running out of time for P1 tools - mitigation is P0 first, P1 as stubs.
