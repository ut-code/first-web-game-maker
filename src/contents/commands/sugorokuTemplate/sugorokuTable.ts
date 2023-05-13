const sugorokuTable = `
  <body>
    <form name="form1">
      <table border="0" cellspacing="5" cellpadding="5">
        <tr>
          <td bgcolor="red">
            <input name="user0" type="text" size="20" value="1P" />
          </td>
          <td>
            <input
              name="button0"
              type="button"
              value="サイコロ"
              onClick="getNum(0)"
            />
          </td>
          <td><div id="dice0"></div></td>
        </tr>
        <tr>
          <td bgcolor="blue">
            <input name="user1" type="text" size="20" value="2P" />
          </td>
          <td>
            <input
              name="button1"
              type="button"
              value="サイコロ"
              onClick="getNum(1)"
            />
          </td>
          <td><div id="dice1"></div></td>
        </tr>
        <tr>
          <td bgcolor="green">
            <input name="user2" type="text" size="20" value="3P" />
          </td>
          <td>
            <input
              name="button2"
              type="button"
              value="サイコロ"
              onClick="getNum(2)"
            />
          </td>
          <td><div id="dice2"></div></td>
        </tr>
        <tr>
          <td bgcolor="yellow">
            <input name="user3" type="text" size="20" value="4P" />
          </td>
          <td>
            <input
              name="button3"
              type="button"
              value="サイコロ"
              onClick="getNum(3)"
            />
          </td>
          <td><div id="dice3"></div></td>
        </tr>
      </table>
    </form>
  </body>
`;

export default sugorokuTable;
