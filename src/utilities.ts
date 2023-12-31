const fingerJoints: Record<string, number[]> = {
  thumb: [0,1,2,3,4],
  indexFinger: [0,5,6,7,8],
  middleFinger: [0,9,10,11,12],
  ringFinger: [0,13,14,15,16],
  pinky: [0,17,18,19,20]
}

export const drawHand = (predictions: any, ctx: CanvasRenderingContext2D) => {
  if(predictions.length > 0) {
    predictions.forEach((prediction) => {
      const landMarks = prediction.landmarks;

      for(let j=0; j < Object.keys(fingerJoints).length; j++) {
        const finger = Object.keys(fingerJoints)[j];
        for(let k = 0; k < fingerJoints[finger].length - 1; k++){
          const firstJointIndex = fingerJoints[finger][k];
          const secondJointIndex = fingerJoints[finger][k + 1];

          ctx.beginPath();
          ctx.moveTo(
            landMarks[firstJointIndex][0],
            landMarks[firstJointIndex][1]
          );
          ctx.lineTo(landMarks[secondJointIndex][0], landMarks[secondJointIndex][1]);
          ctx.strokeStyle = "plum";
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      }

      for(let i=0; i<landMarks.length; i++) {
        const x = landMarks[i][0];
        const y = landMarks[i][1];

        ctx.beginPath();
        ctx.arc(x,y,5,0,3 * Math.PI);

        ctx.fillStyle = 'aqua';
        ctx.fill();
      }
    })
  }
}