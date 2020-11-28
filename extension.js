const vscode = require("vscode");
const fs = require("fs");
let editor = vscode.window.activeTextEditor;
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "py23.Convert",
    function() {

			const methods = {
				failUnlessEqual:"assertEqual",
				assertEquals:"assertEqual",
				failIfEqual:"assertNotEqual",
				assertNotEquals:"assertNotEqual",
				failUnless:"assertTrue",
				assert_:"assertTrue",
				failIf:"assertFalse",
				failUnlessRaises:"assertRaises",
				failUnlessAlmostEqual:"assertAlmostEqual",
				assertAlmostEquals:"assertAlmostEqual",
				failIfAlmostEqual:"assertNotAlmostEqual",
				assertNotAlmostEquals:"assertNotAlmostEqual"
			};

      const re_print = /(print)\s+(.*)$/gm; // print "hello";
			const raw_input = /(raw_input)(\(?.+\)+)$/gm; // name = raw_input() or name = raw_input("What is your name?")
			const exception = /(except\s+)(\w+)(.+)(\s+.*):$/gm //except NameError, err:
			const raise = /(raise\s+)(\w+)(.)(.+\")$/gm // raise IOError, "file error"
			const assertions_re = /failUnlessEqual|assertEquals|failIfEqual|assertNotEquals|failUnless|assert_|failIf|failUnlessRaises|failUnlessAlmostEqual|assertAlmostEquals|failIfAlmostEqual|assertNotAlmostEquals/gm
			const dict_re = /(.+).(has_key)\((.+)\)/gm // dict.has_key(key)
			const getcwd_re = /(os.getcwdu\(\))/gm // os.getcwdu()
      fs.writeFileSync(
        editor.document.uri.fsPath,
        fs
          .readFileSync(editor.document.uri.fsPath, "utf-8")
         .replace(re_print, `print($2)`) // print("hello")
      .replace(raw_input, `input$2`) // name = input() or name = input("what is your name?")
      .replace(exception, `$1 $2 as $4:`) // except NameError as err:
      .replace(raise, `$1 $2($4)`) // raise IOError( "file error"):
      .replace(assertions_re, (matched) => {
        return methods[matched]
      })
      .replace(dict_re, `$3 in $1`) // key in dict
      .replace(getcwd_re, ` os.getcwd()`) // key in dict
      );
      vscode.window.showInformationMessage(
        "file has been converted successfully"
      );
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {}
module.exports = {
  activate,
  deactivate
};